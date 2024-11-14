import { Component, inject, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils.service';

import { Geolocation } from '@capacitor/geolocation';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.model';
import { Seccion } from 'src/app/models/seccion.model';
import { ActivatedRoute } from '@angular/router';

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
  altitude: number | string; // Cambiar el tipo aquí

  firebaseSvc = inject(FirebaseService)
  utilsSvc = inject(UtilsService)

  constructor(private route: ActivatedRoute,private alertController: AlertController,private menuCtrl: MenuController) { 
  
  }
  user(): User{ 
    return this.utilsSvc.getFromLocalStorage('user');
  }




  async obtenerDatosSeccion(id: string) {
    const loading = await this.utilsSvc.loading();
    await loading.present();
    try {
      this.seccion = await this.firebaseSvc.getSeccionPorId(id);
      console.log('Datos de la sección:', this.seccion);
      if (this.seccion) {
        const asignatura = await this.firebaseSvc.getAsignaturaPorId(this.seccion.asignatura);
        if (asignatura) {
          this.nombreAsignatura = asignatura.nombre; 
          this.aula = this.seccion.aula; // Asignar el aula si está en el modelo Seccion
        }
        this.profesorNombre = this.user().name + ' ' + this.user().lastname;
        
        // Generar el código QR después de obtener los datos
        this.generateQRCode();
      }
    } catch (error) {
      console.error('Error obteniendo la sección:', error);
    }
    loading.dismiss();
  }









  async generateQRCode() {
    // Asignar la fecha y hora actuales
    const date = new Date();
    this.currentDate = date.toLocaleDateString(); // Formato de fecha
    this.currentTime = date.toLocaleTimeString(); // Formato de hora
  

    const qrUID = crypto.randomUUID();


    
    // Obtener la ubicación actual
    const coordinates = await this.getCurrentLocation();
    if (coordinates) {
      this.latitude = coordinates.latitude;
      this.longitude = coordinates.longitude;
      this.altitude = coordinates.altitude !== null ? coordinates.altitude : 'N/A'; // Manejar altitud
  
      // Generar el contenido del código QR
      this.qrData = `UID: ${qrUID}, Fecha: ${this.currentDate}, Hora: ${this.currentTime}, Asignatura: ${this.nombreAsignatura}, Sección: ${this.seccionId || 'Sin nombre'}, Ubicación: ${this.latitude}, ${this.longitude}, Altitud: ${this.altitude}`;
      console.log('Latitud:', this.latitude);
      console.log('Longitud:', this.longitude);
      console.log('Altitud:', this.altitude);
      console.log(this.qrData); // Agrega esta línea para verificar el valor
    } else {
      this.utilsSvc.showToast('Error obteniendo la ubicación. Inténtalo de nuevo.');
    }
  }




  
// Método para obtener la ubicación actual
private async getCurrentLocation() {
  try {
    const coordinates = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true, // Solicitar alta precisión
    });
    return {
      latitude: coordinates.coords.latitude,
      longitude: coordinates.coords.longitude,
      altitude: coordinates.coords.altitude !== null ? coordinates.coords.altitude : 0 // Establecer un valor por defecto si es null
    };
  } catch (error) {
    console.error('Error obteniendo la ubicación:', error);
    return null;
  }
}

  
  ngOnInit() {
   // this.menuCtrl.enable(true); // Desactivar el menú en esta vista
    this.generateQRCode(); // Asegúrate de que esto se llama
    this.seccionId = this.route.snapshot.paramMap.get('seccionId') || '';
    console.log('ID de sección a buscar:', this.seccionId);
    if (this.seccionId) {
      this.obtenerDatosSeccion(this.seccionId);
    } else {
      console.error('Sección ID no proporcionado');
    }
  }


 // Método para finalizar y destruir el QR
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
          // Destruir el QR
          this.qrData = ''; // Limpia el contenido del QR
          this.utilsSvc.showToast('La toma de asistencia ha finalizado.');
          this.navegar();
        },
      },
    ],
  });

  await alert.present();
}
  navegar()
  {
    this.utilsSvc.routerLink('/main-estudiante/home-profesor');
  }
}
