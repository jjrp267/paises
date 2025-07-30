import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

interface Pais {
  pais: string;
  continente: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaisService {
  //private url = 'https://websites.ladorianids.com/resources/prueba/list-countries.json';
  private url = 'https://raw.githubusercontent.com/stefanbinder/countries-states/master/countries.json';
  constructor(private http: HttpClient) {}

  //  getCountries(): Observable<Pais[]> {
  //    return this.http.get<Pais[]>(this.url);
  //  }

  getCountries(): Observable<Pais[]> {
    return this.http.get<any[]>(this.url).pipe(
      map(data =>
        data.map(c => ({
          pais: c.name || '',
          continente: c.region || ''
        }))
        //.filter(c => c.pais && c.continente)
      )
    );
  }
}
