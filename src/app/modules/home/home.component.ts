import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  terminoBusqueda = '';

  constructor(private router: Router) { }

  entrarAlMapa(): void {
    this.router.navigate(['/mapa']);
  }

  buscar(): void {
    // Por ahora solo redirige al mapa (en el futuro filtrará resultados)
    if (this.terminoBusqueda.trim()) {
      this.router.navigate(['/mapa']);
    }
  }
}