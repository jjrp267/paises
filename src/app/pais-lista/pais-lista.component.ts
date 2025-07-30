import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { PaisService } from '../services/pais.service';

@Component({
  selector: 'app-pais-lista',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pais-lista.component.html',
  styleUrl: './pais-lista.component.css'
})
export class PaisListaComponent implements OnInit {
  paises: { pais: string, continente: string }[] = [];
  filteredCountries: { pais: string, continente: string }[] = [];
  displayedCountries: { pais: string, continente: string }[] = [];

  filterControl = new FormControl('');
  continentControl = new FormControl('');
  continentes: string[] = [];

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  constructor(private paisService: PaisService) {}

  ngOnInit(): void {
    this.paisService.getCountries().subscribe(data => {
      this.paises = data;
      this.continentes = [...new Set(data.map(c => c.continente))].sort();
      this.applyFilters();
    });

    this.filterControl.valueChanges
      .pipe(debounceTime(300), startWith(''))
      .subscribe(() => {
        this.currentPage = 1;
        this.applyFilters();
      });

    this.continentControl.valueChanges
      .pipe(startWith(''))
      .subscribe(() => {
        this.currentPage = 1;
        this.applyFilters();
      });
  }

  applyFilters(): void {
    const searchText = this.filterControl.value?.toLowerCase() || '';
    const selectedContinent = this.continentControl.value;

    this.filteredCountries = this.paises.filter(c => {
      const matchesCountry = c.pais.toLowerCase().includes(searchText);
      const matchesContinent = selectedContinent ? c.continente === selectedContinent : true;
      return matchesCountry && matchesContinent;
    });

    this.totalPages = Math.ceil(this.filteredCountries.length / this.itemsPerPage);
    this.updateDisplayedCountries();
  }

  updateDisplayedCountries(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedCountries = this.filteredCountries.slice(start, end);
  }

  changePage(delta: number): void {
    const newPage = this.currentPage + delta;
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.updateDisplayedCountries();
    }
  }
}
