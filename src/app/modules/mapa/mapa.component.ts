import { Component, AfterViewInit, OnDestroy, NgZone, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as L from 'leaflet';

/** Interfaz para los puntos de interés del campus */
interface PuntoCampus {
  id: string;
  nombre: string;
  y: number;
  x: number;
  tipo: 'Aula Académica' | 'Laboratorio' | 'Servicios' | 'Administrativo' | 'Deportivo';
  icono: string;
  descripcion: string;
  horario: string;
  pisos: number;
  capacidad: string;
  servicios: string[];
  tiene360: boolean; // Indica si ya tiene fotos 360° disponibles
}

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements AfterViewInit, OnDestroy {
  private map: L.Map | undefined;

  // Datos del popup seleccionado
  public puntoSeleccionado: PuntoCampus | null = null;
  public popupVisible = false;

  // CONFIGURACIÓN DE LA FOTO
  private readonly CONFIG_MAPA = {
    url: 'assets/images/Dron/foto-dron-utn.jpg',
    ancho: 5472,
    alto: 3648
  };

  // PUNTOS DE INTERÉS DEL CAMPUS
  private readonly PUNTOS: PuntoCampus[] = [
    {
      id: 'modulo-1',
      nombre: 'Módulo 1',
      y: 4596, x: 1212,
      tipo: 'Aula Académica',
      icono: '🏫',
      descripcion: 'Edificio principal de aulas y laboratorios básicos. Cuenta con aulas equipadas con tecnología moderna para impartir clases teóricas y prácticas.',
      horario: 'Lunes a Viernes: 7:00 AM - 9:00 PM',
      pisos: 2,
      capacidad: '400 estudiantes',
      servicios: ['Wi-Fi', 'Proyectores', 'Aire Acondicionado', 'Acceso a discapacitados'],
      tiene360: false
    },
    {
      id: 'modulo-2',
      nombre: 'Módulo 2',
      y: 4604, x: 1880,
      tipo: 'Aula Académica',
      icono: '🏛️',
      descripcion: 'Aulas de planta alta y baja. Área administrativa con oficinas de coordinación académica y servicios estudiantiles.',
      horario: 'Lunes a Viernes: 7:00 AM - 9:00 PM',
      pisos: 2,
      capacidad: '350 estudiantes',
      servicios: ['Wi-Fi', 'Proyectores', 'Oficinas Administrativas', 'Sala de Reuniones'],
      tiene360: false
    },
    {
      id: 'modulo-3',
      nombre: 'Módulo 3',
      y: 4608, x: 2508,
      tipo: 'Laboratorio',
      icono: '🔬',
      descripcion: 'Laboratorios especializados de Tecnologías de Información y Electrónica. Equipados con estaciones de trabajo de alto rendimiento.',
      horario: 'Lunes a Viernes: 7:00 AM - 8:00 PM',
      pisos: 2,
      capacidad: '200 estudiantes',
      servicios: ['Wi-Fi', 'Computadoras', 'Equipo Especializado', 'Impresoras 3D'],
      tiene360: false
    },
    {
      id: 'ciencias-basicas',
      nombre: 'Ciencias Básicas',
      y: 4520, x: 4344,
      tipo: 'Laboratorio',
      icono: '🧪',
      descripcion: 'Laboratorios de Química, Física y Biología. Espacios diseñados para la experimentación y el aprendizaje práctico de las ciencias fundamentales.',
      horario: 'Lunes a Viernes: 7:00 AM - 6:00 PM',
      pisos: 1,
      capacidad: '150 estudiantes',
      servicios: ['Equipo de Laboratorio', 'Campanas de Extracción', 'Microscopios', 'Reactivos'],
      tiene360: false
    },
    {
      id: 'soda-restaurante',
      nombre: 'Soda / Restaurante',
      y: 6576, x: 740,
      tipo: 'Servicios',
      icono: '🍽️',
      descripcion: 'Comedor estudiantil y cafetería. Ofrece variedad de platillos, bebidas y snacks a precios accesibles para la comunidad universitaria.',
      horario: 'Lunes a Viernes: 6:30 AM - 7:00 PM',
      pisos: 1,
      capacidad: '120 personas',
      servicios: ['Menú del Día', 'Bebidas', 'Snacks', 'Microondas'],
      tiene360: false
    },
  ];

  constructor(
    private zone: NgZone,
    private router: Router
  ) { }

  ngAfterViewInit(): void {
    this.inicializarMapa();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.ajustarVista();
  }

  // Cerrar popup con tecla Escape
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.cerrarPopup();
  }

  private inicializarMapa(): void {
    const bounds: L.LatLngBoundsExpression = [[0, 0], [this.CONFIG_MAPA.alto, this.CONFIG_MAPA.ancho]];

    this.map = L.map('map', {
      crs: L.CRS.Simple,
      minZoom: -10,
      maxZoom: 2,
      zoomControl: false,
      attributionControl: false,
      // --- BLOQUEO TOTAL DEL MAPA ---
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      boxZoom: false,
      keyboard: false,
      // --- Limitar a los bounds de la imagen ---
      maxBounds: bounds,
      maxBoundsViscosity: 1.0
    });

    L.imageOverlay(this.CONFIG_MAPA.url, bounds).addTo(this.map);

    // Ajustar la vista para cubrir toda la pantalla sin espacios en blanco
    this.ajustarVista();

    // Clic en el fondo cierra el popup
    this.map.on('click', () => {
      this.zone.run(() => {
        this.cerrarPopup();
      });
    });

    this.cargarPuntos();
  }

  /**
   * Calcula el zoom necesario para que la imagen cubra toda la pantalla
   * sin dejar espacios en blanco en ningún lado.
   */
  private ajustarVista(): void {
    if (!this.map) return;

    const container = this.map.getContainer();
    const containerW = container.clientWidth;
    const containerH = container.clientHeight;

    const imgW = this.CONFIG_MAPA.ancho;
    const imgH = this.CONFIG_MAPA.alto;

    // Calcular zoom para cubrir (fill)
    const zoomX = Math.log2(containerW / imgW);
    const zoomY = Math.log2(containerH / imgH);
    const zoomCover = Math.max(zoomX, zoomY);

    // Centrar la vista en el centro de la imagen
    const center: L.LatLngExpression = [imgH / 2, imgW / 2];
    this.map.setView(center, zoomCover);
  }

  private cargarPuntos(): void {
    this.PUNTOS.forEach(punto => {
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="marker-pulse"></div>
          <div class="marker-pin">
            <div class="marker-dot"></div>
          </div>
          <div class="marker-tail"></div>
        `,
        iconSize: [20, 28],
        iconAnchor: [10, 28]
      });

      const marker = L.marker([punto.y, punto.x], {
        icon: customIcon,
        title: punto.nombre
      }).addTo(this.map!);

      marker.on('click', (e: L.LeafletMouseEvent) => {
        L.DomEvent.stopPropagation(e);

        this.zone.run(() => {
          this.puntoSeleccionado = punto;
          this.popupVisible = true;
        });
      });
    });
  }

  /** Cierra el popup de información */
  public cerrarPopup(): void {
    this.popupVisible = false;
    // Esperar a que termine la animación antes de limpiar datos
    setTimeout(() => {
      if (!this.popupVisible) {
        this.puntoSeleccionado = null;
      }
    }, 300);
  }

  /** Abre la vista 360° del campus seleccionado (preparado para futuro) */
  public explorarCampus(punto: PuntoCampus): void {
    if (punto.tiene360) {
      // Cuando haya fotos 360°, navegar a la vista de campus
      this.router.navigate(['/campus', punto.id]);
    } else {
      // Por ahora, mostrar un mensaje de "próximamente"
      // En el futuro, esto será reemplazado por la navegación a la vista 360°
      alert(`🚧 Vista 360° de "${punto.nombre}" estará disponible próximamente.`);
    }
  }

  /** Obtener el color del badge según el tipo */
  public getColorTipo(tipo: string): string {
    switch (tipo) {
      case 'Aula Académica': return '#00205B';
      case 'Laboratorio': return '#7B2D8E';
      case 'Servicios': return '#F05E23';
      case 'Administrativo': return '#2E7D32';
      case 'Deportivo': return '#1565C0';
      default: return '#666';
    }
  }


  public zoomIn(): void {
    this.map?.zoomIn();
  }

  public zoomOut(): void {
    this.map?.zoomOut();
  }

  public centrarMapa(): void {
    this.ajustarVista();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}