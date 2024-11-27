
import { Component } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-generar-profesor',
  templateUrl: './generar-profesor.page.html',
  styleUrls: ['./generar-profesor.page.scss'],
})
export class GenerarProfesorPage {
  qrConfig: any = {};

  constructor(private localStorageService: LocalStorageService) {}

  guardarQRConfig(config: any): void {
    this.qrConfig = config;
    this.localStorageService.setItem('qrConfig', this.qrConfig);
    console.log('Configuración de QR guardada:', this.qrConfig);
  }

  cargarQRConfig(): void {
    this.qrConfig = this.localStorageService.getItem('qrConfig') || {};
    console.log('Configuración de QR cargada desde localStorage:', this.qrConfig);
  }
}
