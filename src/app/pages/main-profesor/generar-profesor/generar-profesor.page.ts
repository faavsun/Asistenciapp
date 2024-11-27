
import { Component } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-generar-profesor',
  templateUrl: './generar-profesor.page.html',
  styleUrls: ['./generar-profesor.page.scss'],
})
export class GenerarProfesorPage {
  qrConfig: any = {};

  constructor(
    private localStorageService: LocalStorageService,
    private firebaseService: FirebaseService
  ) {}

  async guardarQRConfig(config: any): Promise<void> {
    try {
      await this.firebaseService.guardarQRConfig(config);
      this.qrConfig = config;
      this.localStorageService.setItem('qrConfig', this.qrConfig);
      console.log('Configuración de QR guardada en Firebase y localStorage:', this.qrConfig);
    } catch (error) {
      console.error('Error al guardar QR en Firebase, guardando solo local:', error);
      this.qrConfig = config;
      this.localStorageService.setItem('qrConfig', this.qrConfig);
    }
  }

  async cargarQRConfig(): Promise<void> {
    try {
      this.qrConfig = await this.firebaseService.cargarQRConfig();
      this.localStorageService.setItem('qrConfig', this.qrConfig);
      console.log('Configuración de QR cargada desde Firebase:', this.qrConfig);
    } catch (error) {
      console.error('Error al cargar QR desde Firebase, usando localStorage:', error);
      this.qrConfig = this.localStorageService.getItem('qrConfig') || {};
    }
  }
}
