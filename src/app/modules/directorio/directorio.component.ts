import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-directorio',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './directorio.component.html',
    styleUrls: ['./directorio.component.scss']
})
export class DirectorioComponent {
    tabActivo: 'profesores' | 'aulas' = 'profesores';
    filtro = '';

    constructor(private router: Router) { }

    profesores = [
        { nombre: 'Ing. Carlos Rodríguez Mora', departamento: 'Ingeniería en TI', correo: 'crodriguez@utn.ac.cr', modulo: 'Módulo 1', foto: 'https://i.pravatar.cc/150?img=12' },
        { nombre: 'Lic. María Fernández Solís', departamento: 'Ciencias Básicas', correo: 'mfernandez@utn.ac.cr', modulo: 'Módulo 3', foto: 'https://i.pravatar.cc/150?img=32' },
        { nombre: 'MSc. José Campos Vargas', departamento: 'Ingeniería en TI', correo: 'jcampos@utn.ac.cr', modulo: 'Módulo 1', foto: 'https://i.pravatar.cc/150?img=15' },
        { nombre: 'Ing. Laura Mora Castillo', departamento: 'Electrónica', correo: 'lmora@utn.ac.cr', modulo: 'Módulo 2', foto: 'https://i.pravatar.cc/150?img=26' },
        { nombre: 'Lic. Roberto Jiménez Araya', departamento: 'Administración', correo: 'rjimenez@utn.ac.cr', modulo: 'Módulo 2', foto: 'https://i.pravatar.cc/150?img=53' },
        { nombre: 'MSc. Andrea Villalobos Chacón', departamento: 'Ciencias Básicas', correo: 'avillalobos@utn.ac.cr', modulo: 'Módulo 3', foto: 'https://i.pravatar.cc/150?img=44' },
        { nombre: 'Ing. Diego Salazar Ramírez', departamento: 'Ingeniería en TI', correo: 'dsalazar@utn.ac.cr', modulo: 'Módulo 1', foto: 'https://i.pravatar.cc/150?img=59' },
        { nombre: 'Lic. Patricia Hernández López', departamento: 'Administración', correo: 'phernandez@utn.ac.cr', modulo: 'Módulo 2', foto: 'https://i.pravatar.cc/150?img=47' },
    ];

    aulas = [
        { codigo: 'A-101', modulo: 'Módulo 1', capacidad: 35, tipo: 'Aula', estado: 'Disponible' },
        { codigo: 'A-102', modulo: 'Módulo 1', capacidad: 35, tipo: 'Aula', estado: 'Ocupada' },
        { codigo: 'A-103', modulo: 'Módulo 1', capacidad: 40, tipo: 'Aula', estado: 'Disponible' },
        { codigo: 'L-201', modulo: 'Módulo 1', capacidad: 25, tipo: 'Laboratorio TI', estado: 'Ocupada' },
        { codigo: 'L-202', modulo: 'Módulo 1', capacidad: 25, tipo: 'Laboratorio TI', estado: 'Disponible' },
        { codigo: 'B-101', modulo: 'Módulo 2', capacidad: 40, tipo: 'Aula', estado: 'Disponible' },
        { codigo: 'B-102', modulo: 'Módulo 2', capacidad: 30, tipo: 'Aula', estado: 'Ocupada' },
        { codigo: 'L-301', modulo: 'Módulo 2', capacidad: 20, tipo: 'Laboratorio Electrónica', estado: 'Disponible' },
        { codigo: 'C-101', modulo: 'Módulo 3', capacidad: 45, tipo: 'Auditorio', estado: 'Disponible' },
        { codigo: 'L-401', modulo: 'Módulo 3', capacidad: 20, tipo: 'Laboratorio Química', estado: 'Ocupada' },
        { codigo: 'L-402', modulo: 'Módulo 3', capacidad: 20, tipo: 'Laboratorio Física', estado: 'Disponible' },
    ];

    get profesoresFiltrados() {
        if (!this.filtro.trim()) return this.profesores;
        const f = this.filtro.toLowerCase();
        return this.profesores.filter(p =>
            p.nombre.toLowerCase().includes(f) ||
            p.departamento.toLowerCase().includes(f) ||
            p.modulo.toLowerCase().includes(f)
        );
    }

    get aulasFiltradas() {
        if (!this.filtro.trim()) return this.aulas;
        const f = this.filtro.toLowerCase();
        return this.aulas.filter(a =>
            a.codigo.toLowerCase().includes(f) ||
            a.modulo.toLowerCase().includes(f) ||
            a.tipo.toLowerCase().includes(f)
        );
    }

    irAlMapa(): void {
        this.router.navigate(['/mapa']);
    }

    // Lightbox
    fotoAbierta: { nombre: string; departamento: string; foto: string } | null = null;

    abrirFoto(prof: { nombre: string; departamento: string; foto: string }, event: MouseEvent): void {
        event.stopPropagation();
        this.fotoAbierta = prof;
    }

    cerrarFoto(): void {
        this.fotoAbierta = null;
    }
}
