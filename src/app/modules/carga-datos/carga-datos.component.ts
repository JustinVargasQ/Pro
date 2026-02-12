import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-carga-datos',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './carga-datos.component.html',
    styleUrls: ['./carga-datos.component.scss']
})
export class CargaDatosComponent {
    archivoSeleccionado: File | null = null;
    arrastrando = false;

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.arrastrando = true;
    }

    onDragLeave(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.arrastrando = false;
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.arrastrando = false;

        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
            this.procesarArchivo(files[0]);
        }
    }

    onFileSelect(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.procesarArchivo(input.files[0]);
        }
    }

    procesarArchivo(file: File): void {
        // Solo visual por ahora
        this.archivoSeleccionado = file;
    }

    eliminarArchivo(): void {
        this.archivoSeleccionado = null;
    }

    subirArchivo(): void {
        // Solo visual por ahora — en el futuro se conecta al backend
        alert('Funcionalidad próximamente. El archivo se procesará para alimentar el mapa.');
    }
}
