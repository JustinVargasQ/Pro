import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { MapaComponent } from './modules/mapa/mapa.component';
import { CargaDatosComponent } from './modules/carga-datos/carga-datos.component';
import { DirectorioComponent } from './modules/directorio/directorio.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Inicio - UTN Maps'
  },
  {
    path: 'mapa',
    component: MapaComponent,
    title: 'Mapa del Campus - UTN Maps'
  },
  {
    path: 'carga-datos',
    component: CargaDatosComponent,
    title: 'Carga de Datos - UTN Maps'
  },
  {
    path: 'directorio',
    component: DirectorioComponent,
    title: 'Directorio - UTN Maps'
  },
  {
    path: '**',
    redirectTo: ''
  }
];