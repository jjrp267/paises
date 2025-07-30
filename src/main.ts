import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { PaisListaComponent } from './app/pais-lista/pais-lista.component';

bootstrapApplication(PaisListaComponent, {
  providers: [
    importProvidersFrom(HttpClientModule)
  ]
});