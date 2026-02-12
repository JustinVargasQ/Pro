import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { MapaComponent } from './modules/mapa/mapa.component';

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent, // <--- Esto garantiza que el Home sea lo primero
    title: 'Inicio - UTN Maps' 
  },
  { 
    path: 'mapa', 
    component: MapaComponent,
    title: 'Mapa del Campus - UTN Maps' 
  },
  { 
    path: '**', 
    redirectTo: '' 
  } // Redirección de seguridad
];