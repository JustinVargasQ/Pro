import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa',
  standalone: true,
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements AfterViewInit, OnDestroy {
  private map: L.Map | undefined;
  private markers: L.Marker[] = []; // Guardamos los marcadores para leerlos luego

  // CONFIGURACIÓN DE TU FOTO
  private readonly CONFIG_MAPA = {
    url: 'foto-dron-utn.jpg',
    ancho: 5472,
    alto: 3648
  };

  ngAfterViewInit(): void {
    this.inicializarMapa();
  }

  private inicializarMapa(): void {
    // Definimos el área de la imagen
    const bounds: L.LatLngBoundsExpression = [[0, 0], [this.CONFIG_MAPA.alto, this.CONFIG_MAPA.ancho]];

    this.map = L.map('map', {
      crs: L.CRS.Simple,
      minZoom: -3,
      maxZoom: 1,
      zoomControl: false, // Zoom manual
      attributionControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);
    L.imageOverlay(this.CONFIG_MAPA.url, bounds).addTo(this.map);
    this.map.fitBounds(bounds);

    // --- MODO CALIBRACIÓN ---
    // Cargamos los puntos "aproximados" para que aparezcan en pantalla
    // Si salen mal, NO IMPORTA, arrástralos con el mouse.
    this.crearMarcadorArrastrable(2000, 1500, 'MÓDULO 1');
    this.crearMarcadorArrastrable(2000, 2000, 'MÓDULO 2');
    this.crearMarcadorArrastrable(2000, 2500, 'MÓDULO 3');
    this.crearMarcadorArrastrable(1500, 4000, 'CIENCIAS BÁSICAS');
    this.crearMarcadorArrastrable(1000, 1000, 'SODA / RESTAURANTE');
  }

  // Crea un punto que tú puedes mover
  private crearMarcadorArrastrable(y: number, x: number, nombre: string): void {
    // Usamos un icono estándar para calibrar mejor la punta
    const icono = L.icon({
      iconUrl: 'marker-icon.png', // Asegúrate de tenerlo en public
      shadowUrl: 'marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    });

    const marker = L.marker([y, x], { 
      icon: icono,
      draggable: true, // <--- ESTO TE DEJA MOVERLOS
      title: nombre    // Pone el nombre al pasar el mouse
    }).addTo(this.map!);

    marker.bindPopup(`<b>${nombre}</b><br>Arróstrame a mi lugar.`);
    
    // Guardamos referencia para imprimir después
    (marker as any).nombrePunto = nombre;
    this.markers.push(marker);
  }

  // ESTA FUNCIÓN ES LA MAGIA
  public imprimirCoordenadas(): void {
    console.clear();
    console.log('--- COPIA DESDE AQUÍ ---');
    console.log('const puntos = [');
    
    this.markers.forEach(m => {
      const pos = m.getLatLng();
      const nombre = (m as any).nombrePunto;
      // Imprime el formato exacto para el código final
      console.log(`  { nombre: '${nombre}', y: ${Math.round(pos.lat)}, x: ${Math.round(pos.lng)}, tipo: 'aula' },`);
    });

    console.log('];');
    console.log('--- HASTA AQUÍ ---');
    alert('¡Coordenadas generadas! Revisa la consola del navegador (F12) y mándamelas.');
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}