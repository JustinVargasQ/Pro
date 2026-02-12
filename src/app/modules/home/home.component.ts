import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private router: Router) {}

  entrarAlMapa(): void {
    // Navega hacia la ruta definida en app.routes.ts
    this.router.navigate(['/mapa']);
  }
}