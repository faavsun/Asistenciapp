import { Component, inject, OnInit } from '@angular/core';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { Asignatura } from 'src/app/models/asignatura.model'; 
import { Seccion } from 'src/app/models/seccion.model'; 
import { ActivatedRoute } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-marcar',
  templateUrl: './marcar.page.html',
  styleUrls: ['./marcar.page.scss'],
})
export class MarcarPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  latitude: number;
  longitude: number;
  altitude: number | string; 
  ScanResult = '';
  
  currentDate: string;
  currentTime: string;

  asignatura: Asignatura;
  seccion: Seccion;

  constructor(
    private alertController: AlertController,
    private menuCtrl: MenuController,
    private modalController: ModalController,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
  //  this.menuCtrl.enable(true);
    this.route.paramMap.subscribe(params => {
      const seccionId = params.get('seccionId');
      if (seccionId) {
        this.loadSeccionAndAsignatura(seccionId);
      }
    });
  }

  async loadSeccionAndAsignatura(seccionId: string) {
    const loading = await this.utilsSvc.loading();
    await loading.present();
    
    // Obtiene la ubicación actual
    const { latitude, longitude, altitude } = await this.getCurrentLocation() || {};
    this.latitude = latitude;
    this.longitude = longitude;
    this.altitude = altitude !== undefined ? altitude : 'N/A';
  
    // Obtiene la fecha y hora actual
    const date = new Date();
    this.currentDate = date.toLocaleDateString();
    this.currentTime = date.toLocaleTimeString();
  
    try {
      // Obtiene la sección y la asignatura en paralelo
      const seccionPromise = this.firebaseSvc.getSeccionPorId(seccionId);
      const asignaturaPromise = seccionPromise.then(seccion => 
        this.firebaseSvc.getAsignaturaPorId(seccion.asignatura));
      
      // Espera las promesas de forma paralela
      const [seccion, asignatura] = await Promise.all([seccionPromise, asignaturaPromise]);
  
      // Actualiza las propiedades con los datos obtenidos
      this.seccion = seccion;
      this.asignatura = asignatura;
  
      // Obtiene el nombre del profesor solo si se encontró la sección
      if (this.seccion && this.seccion.profesor) {
        const profesor = await this.firebaseSvc.getUserById(this.seccion.profesor);
        this.seccion.profesor = profesor ? `${profesor.name} ${profesor.lastname}` : 'Nombre del Profesor';
      }
  
      console.log('Datos de la sección:', this.seccion);
      console.log('Datos de la asignatura:', this.asignatura);
    } catch (error) {
      console.error('Error al cargar sección o asignatura:', error);
    } finally {
      // Asegúrate de ocultar el loading
      loading.dismiss();
    }
  }
  private async getCurrentLocation() {
    try {
      const coordinates = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      return {
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude,
        altitude: coordinates.coords.altitude ?? 0 // Usar el operador de coalescencia nula
      };
    } catch (error) {
      console.error('Error obteniendo la ubicación:', error);
      return null;
    }
  }

  async startScan() {
    const modal = await this.modalController.create({
      component: BarcodeScanningModalComponent,
      cssClass: 'barcode-scanning-modal',
      showBackdrop: false,
      componentProps: { 
        formats: [],
        lensFacing: LensFacing.Back
      }
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data?.barcode?.displayValue) {
      this.ScanResult = data.barcode.displayValue;
      this.Marcar();
    } else {
      console.log('No se escaneó un código QR válido.');
    }
  }

  async registerAttendance(uidFromQR: string) {
    try {
      const asistencia = await this.firebaseSvc.getAsistenciaPorUid(uidFromQR);
      
      if (asistencia) {
        const updatedTotal = (asistencia.total_asistencia || 0) + 1;
        await this.firebaseSvc.updateAsistencia(uidFromQR, updatedTotal);
        console.log('Asistencia registrada con éxito');
      } else {
        const nuevoRegistroAsistencia = {
          uid: uidFromQR,
          seccion_id: this.seccion?.uid,
          total_asistencias: 1
        };
        await this.firebaseSvc.crearAsistencia(nuevoRegistroAsistencia);
        console.log('Nuevo registro de asistencia creado con éxito');
      }
    } catch (error) {
      console.error('Error al registrar asistencia:', error);
    }
  }
  
  // Call this method in Marcar()
  async Marcar() {
    const alert = await this.createAlert('Registrar asistencia', '¿Acepta registrar asistencia?');
    await alert.present();
    
    const alertResult = await alert.onDidDismiss();
    if (alertResult.role === 'confirm') {
      await this.registerAttendance(this.ScanResult);
    }
  }

  private async createAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => console.log('Botón Cancelar'),
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => this.navegar(),
        },
      ],
    });
    return alert;
  }

  navegar() {
    this.utilsSvc.routerLink('/main-estudiante/home');
  }
}