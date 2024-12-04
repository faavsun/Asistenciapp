import { Component, inject, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { NavController, MenuController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils.service';

import { Geolocation } from '@capacitor/geolocation';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.model';
import { Seccion } from 'src/app/models/seccion.model';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-generar-profesor',
  templateUrl: './generar-profesor.page.html',
  styleUrls: ['./generar-profesor.page.scss'],
})
export class GenerarProfesorPage implements OnInit {
  seccionId: string;
  seccion: Seccion | null = null;

  nombreAsignatura: string = '';
  profesorNombre: string = '';
  aula: string = 'xxx-x';

  currentDate: string;
  currentTime: string;
  qrData: string;
  latitude: number;
  longitude: number;
  altitude: number | string; // Manejar altitud null

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  localStorageSvc = inject(LocalStorageService);

  constructor(
    private route: ActivatedRoute,
    private alertController: AlertController,
    private menuCtrl: MenuController,
    private navCtrl: NavController
  ) {}

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  async obtenerDatosSeccion(id: string) {
    const loading = await this.utilsSvc.loading();
    await loading.present();

    try {
      const isConnected = await this.utilsSvc.checkInternetConnection();

      if (isConnected) {
        console.log('Conexión a internet detectada, obteniendo datos desde Firebase...');
        this.seccion = await this.firebaseSvc.getSeccionPorId(id);

        if (this.seccion) {
          const asignatura = await this.firebaseSvc.getAsignaturaPorId(this.seccion.asignatura);
          if (asignatura) {
            this.nombreAsignatura = asignatura.nombre;
          } else {
            this.nombreAsignatura = 'Asignatura desconocida';
          }

          // Guardar datos en el almacenamiento local
          const seccionConNombre = { ...this.seccion, nombreAsignatura: this.nombreAsignatura };
          await this.localStorageSvc.set(`seccion_${id}`, seccionConNombre);

          this.aula = this.seccion.aula;
          this.profesorNombre = `${this.user().name} ${this.user().lastname}`;

          this.generateQRCode();
        }
      } else {
        console.log('No hay conexión, obteniendo datos desde almacenamiento local...');
        const seccionLocal = await this.localStorageSvc.get(`seccion_${id}`);
        if (seccionLocal) {
          this.seccion = seccionLocal;
          this.nombreAsignatura = seccionLocal.nombreAsignatura || 'Sin nombre';
          this.aula = seccionLocal.aula || 'Sin aula';
          this.profesorNombre = `${this.user().name} ${this.user().lastname}`;

          this.generateQRCode();
        } else {
          console.error('No se encontraron datos locales para esta sección.');
          this.utilsSvc.showToast('No hay datos disponibles para esta sección en modo offline.');
        }
      }
    } catch (error) {
      console.error('Error obteniendo la sección:', error);
      this.utilsSvc.showToast('Error cargando los datos de la sección.');
    } finally {
      loading.dismiss();
    }
  }

  async generateQRCode() {
    const date = new Date();
    this.currentDate = date.toLocaleDateString();
    this.currentTime = date.toLocaleTimeString();

    const qrUID = crypto.randomUUID();

    // Obtén la ubicación actual o la última conocida
    const coordinates = await this.getCurrentLocation();
    if (coordinates) {
      this.latitude = coordinates.latitude;
      this.longitude = coordinates.longitude;
      this.altitude = coordinates.altitude || 'N/A';

      // Genera el contenido del código QR con los datos
      this.qrData = `UID: ${qrUID}, Fecha: ${this.currentDate}, Hora: ${this.currentTime}, Asignatura: ${this.nombreAsignatura}, Sección: ${this.seccionId || 'Sin nombre'}, Ubicación: ${this.latitude}, ${this.longitude}, Altitud: ${this.altitude}`;
      console.log('Datos del QR:', this.qrData);
    } else {
      this.utilsSvc.showToast('Error: No se pudo obtener la ubicación. El QR no incluirá datos de ubicación.');
      this.qrData = `UID: ${qrUID}, Fecha: ${this.currentDate}, Hora: ${this.currentTime}, Asignatura: ${this.nombreAsignatura}, Sección: ${this.seccionId || 'Sin nombre'}`;
    }
  }

  private async getCurrentLocation() {
    try {
      // Intenta obtener la ubicación actual
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000, // Tiempo de espera
      });

      const location = {
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude,
        altitude: coordinates.coords.altitude || 0,
      };

      // Guarda la ubicación en el almacenamiento local
      await this.localStorageSvc.set('last_location', location);

      console.log('Ubicación actual obtenida y guardada:', location);
      return location;
    } catch (error) {
      console.error('Error obteniendo la ubicación actual:', error);

      // Intenta recuperar la última ubicación conocida
      const lastLocation = await this.localStorageSvc.get('last_location');
      if (lastLocation) {
        console.warn('Usando la última ubicación conocida:', lastLocation);
        return lastLocation;
      } else {
        console.error('No hay datos de ubicación disponibles.');
        return null;
      }
    }
  }

  async Finalizar() {
    const alert = await this.alertController.create({
      header: 'Registrar asistencia',
      message: '¿Desea finalizar la toma de asistencia?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Botón Cancelar');
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.qrData = '';
            this.utilsSvc.showToast('La toma de asistencia ha finalizado.');
            this.navegar();
          },
        },
      ],
    });

    await alert.present();
  }

  navegar() {
    this.navCtrl.back();
  }

  ngOnInit() {
    this.menuCtrl.enable(true, 'menu-profesor');
    this.seccionId = this.route.snapshot.paramMap.get('seccionId') || '';
    console.log('ID de sección a buscar:', this.seccionId);
    if (this.seccionId) {
      this.obtenerDatosSeccion(this.seccionId);
    } else {
      console.error('Sección ID no proporcionado');
    }
  }
}
