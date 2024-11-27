
import { Component } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-main-estudiante',
  templateUrl: './main-estudiante.page.html',
  styleUrls: ['./main-estudiante.page.scss'],
})
export class MainEstudiantePage {
  asistenciaHistorial: any[] = [];

  constructor(private localStorageService: LocalStorageService) {}

  guardarAsistencia(asistencia: any): void {
    this.asistenciaHistorial.push(asistencia);
    this.localStorageService.setItem('historialAsistencias', this.asistenciaHistorial);
    console.log('Historial de asistencias actualizado:', this.asistenciaHistorial);
  }

  cargarHistorial(): void {
    this.asistenciaHistorial = this.localStorageService.getItem('historialAsistencias') || [];
    console.log('Historial de asistencias desde localStorage:', this.asistenciaHistorial);
  }
}
