
import { Component } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-main-estudiante',
  templateUrl: './main-estudiante.page.html',
  styleUrls: ['./main-estudiante.page.scss'],
})
export class MainEstudiantePage {
  asistenciaHistorial: any[] = [];

  constructor(
    private localStorageService: LocalStorageService,
    private firebaseService: FirebaseService
  ) {}

  async guardarAsistencia(asistencia: any): Promise<void> {
    try {
      await this.firebaseService.guardarAsistencia(asistencia);
      this.asistenciaHistorial.push(asistencia);
      this.localStorageService.setItem('historialAsistencias', this.asistenciaHistorial);
      console.log('Asistencia guardada en Firebase y localStorage:', asistencia);
    } catch (error) {
      console.error('Error al guardar en Firebase, solo guardado local:', error);
      this.asistenciaHistorial.push(asistencia);
      this.localStorageService.setItem('historialAsistencias', this.asistenciaHistorial);
    }
  }

  async cargarHistorial(): Promise<void> {
    try {
      this.asistenciaHistorial = await this.firebaseService.cargarHistorial();
      this.localStorageService.setItem('historialAsistencias', this.asistenciaHistorial);
      console.log('Historial cargado desde Firebase:', this.asistenciaHistorial);
    } catch (error) {
      console.error('Error al cargar historial desde Firebase, usando localStorage:', error);
      this.asistenciaHistorial = this.localStorageService.getItem('historialAsistencias') || [];
    }
  }
}
