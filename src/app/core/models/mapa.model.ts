export interface PuntoInteres {
  id: string;
  nombre: string;
  y: number;
  x: number;
  tipo: 'NIVEL' | 'MULTIMEDIA'; // Si abre otro mapa o abre un video/foto
  imagenDestino?: string;       // Nueva foto (ej: modulo1.jpg)
  urlMedia?: string;           // URL del video o foto final
  puntosHijos?: PuntoInteres[]; // Pines dentro de este nivel
}