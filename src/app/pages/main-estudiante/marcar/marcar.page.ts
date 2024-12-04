import { Component, inject, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { Asignatura } from 'src/app/models/asignatura.model';
import { Seccion } from 'src/app/models/seccion.model';
import { ActivatedRoute } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-marcar',
  templateUrl: './marcar.page.html',
  styleUrls: ['./marcar.page.scss'],
})
export class MarcarPage implements OnInit {
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  localStorageSvc = inject(LocalStorageService);
  latitude: number;
  longitude: number;
  altitude: number | string;
  ScanResult = '';
  currentDate: string;
  currentTime: string;

  asignatura: Asignatura;
  seccion: Seccion;
  nombre: string;
  alumnoUid: string = ''; // Almacenaremos el UID del alumno aquí

  constructor(
    private alertController: AlertController,
    private menuCtrl: MenuController,
    private modalController: ModalController,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.menuCtrl.enable(true, 'menu-estudiante');
    this.route.paramMap.subscribe(params => {
      const seccionId = params.get('seccionId');
      if (seccionId) {
        this.loadSeccionAndAsignatura(seccionId);
      }
    });
    // Obtener el objeto completo del usuario desde localStorage
    const userData = localStorage.getItem('user');

    if (userData) {
      const user = JSON.parse(userData);
      this.alumnoUid = user.uid; // Guardar UID en la propiedad del componente
    }


  }

  async loadSeccionAndAsignatura(seccionId: string) {
    const loading = await this.utilsSvc.loading();
    await loading.present();

    try {
      // Obtiene la fecha y hora actual
      const date = new Date();
      this.currentDate = date.toLocaleDateString();
      this.currentTime = date.toLocaleTimeString();

      // Verifica si el dispositivo está en línea
      const isOnline = await this.utilsSvc.checkInternetConnection();



      if (isOnline) {
        // Si está en línea, obtener datos de Firebase
        const seccionPromise = this.firebaseSvc.getSeccionPorId(seccionId);
        const asignaturaPromise = seccionPromise.then(seccion =>
          this.firebaseSvc.getAsignaturaPorId(seccion.asignatura)
        );

        const [seccion, asignatura] = await Promise.all([seccionPromise, asignaturaPromise]);
        this.seccion = seccion;
        this.asignatura = asignatura;

        // Guarda los datos en almacenamiento local para futuras consultas offline
        await this.localStorageSvc.set(`seccion_${seccionId}`, seccion);
        await this.localStorageSvc.set(`asignatura_${seccion.asignatura}`, asignatura);

        console.log('Datos del seccion del locallll:', this.seccion);
        console.log('Datos del profesor:', this.seccion.profesor);


        if (this.seccion && this.seccion.profesor) {
          const profesor = await this.firebaseSvc.getUserById(this.seccion.profesor);
          this.seccion.profesor = profesor ? `${profesor.name} ${profesor.lastname}` : 'Nombre del Profesor';
          // Guardar el nombre del profesor en el localStorage
          this.nombre = profesor ? `${profesor.uid}`: 'uid del profesor';
          console.log('Datos del profesor del locallll:', this.seccion.profesor);
          await this.localStorageSvc.set(`profesor_${this.nombre}`, profesor);
        }

        // Obtén la ubicación actual o la última conocida
        const coordinates = await this.getCurrentLocation();

        this.latitude = coordinates.latitude;
        this.longitude = coordinates.longitude;
        this.altitude = coordinates.altitude || 'N/A';



      } else {
        // Si está fuera de línea, obtener datos desde almacenamiento local
        const storedSeccion = await this.localStorageSvc.get(`seccion_${seccionId}`);
        const storedAsignatura = await this.localStorageSvc.get(`asignatura_${storedSeccion?.asignatura}`);

        this.seccion = storedSeccion;
        this.asignatura = storedAsignatura;
        console.log('antes:',storedSeccion);
        if (this.seccion && this.seccion.profesor) {
          // Si no hay nombre del profesor, intenta obtenerlo desde localStorage
          const profesor = await this.localStorageSvc.get(`profesor_${this.seccion.profesor}`);
          console.log('durante:', profesor);
          console.log('durante:', this.seccion);
          console.log('durante:', this.asignatura);
          console.log('durante:', this.seccion.profesor);
          if (profesor) {
            console.log('Datos del profesor del locallll:');
            console.log('Datos del profesor del locallll:', profesor.name, profesor.lastname);
            this.seccion.profesor = `${profesor.name} ${profesor.lastname}`;
          }
        }

        // Obtén la ubicación actual o la última conocida
        const coordinates = await this.getCurrentLocation();

        this.latitude = coordinates.latitude;
        this.longitude = coordinates.longitude;
        this.altitude = coordinates.altitude || 'N/A';





      }
    } catch (error) {
      console.error('Error al cargar sección o asignatura:', error);
    } finally {
      loading.dismiss();
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





  async startScan() {
    const modal = await this.modalController.create({
      component: BarcodeScanningModalComponent,
      cssClass: 'barcode-scanning-modal',
      showBackdrop: false,
      componentProps: { 
        formats: [], // si deseas limitar a ciertos tipos de códigos
        lensFacing: LensFacing.Back
      }
    });
  
    await modal.present();
    const { data } = await modal.onWillDismiss();
  
    if (data?.barcode?.displayValue) {
      this.ScanResult = data.barcode.displayValue;
  
      // Verifica si el UID ya está almacenado en el localStorage
      const scannedUID = this.extractUID(this.ScanResult);
      if (this.isUIDAlreadyScanned(scannedUID)) {
        this.utilsSvc.showToast('Este código QR ya ha sido escaneado anteriormente.');
        return;
      }
  
      // Verifica si la sección y la fecha en el QR coinciden con la actual
      const isSectionValid = await this.validateSection(this.ScanResult);
      const isDateValid = this.validateDate(this.ScanResult);
      const isPositionValid = await this.validatePosition(this.ScanResult);
  
      if (isSectionValid && isDateValid && isPositionValid) {
        // Si la sección y la fecha son válidas, marca la asistencia
        await this.Marcar();  
        
        // Guarda el UID en el localStorage para evitar que se escanee nuevamente
        this.saveUIDToLocalStorage(scannedUID);
      } else {
        this.utilsSvc.showToast('El código QR no es válido: sección, fecha o posición incorrecta.');
      }
    } else {
      console.log('No se escaneó un código QR válido.');
    }
  }
  
  // Método para extraer el UID del código QR
  extractUID(scanResult: string): string {
    const regexUID = /UID:\s*([^,]+)/;
    const match = scanResult.match(regexUID);
  
    if (match && match[1]) {
      return match[1].trim(); // Devuelve el UID encontrado
    } else {
      console.error('No se pudo extraer el UID del QR');
      return '';
    }
  }
  
  // Método para verificar si el UID ya está almacenado en el localStorage
  isUIDAlreadyScanned(uid: string): boolean {
    const scannedUIDs = localStorage.getItem('scannedUIDs');
    if (scannedUIDs) {
      const scannedArray = JSON.parse(scannedUIDs);
      return scannedArray.includes(uid); // Verifica si el UID ya ha sido escaneado
    }
    return false;
  }
  
  // Método para guardar el UID en el localStorage
  saveUIDToLocalStorage(uid: string): void {
    const scannedUIDs = localStorage.getItem('scannedUIDs');
    let scannedArray = scannedUIDs ? JSON.parse(scannedUIDs) : [];
  
    // Añadir el UID al arreglo
    scannedArray.push(uid);
  
    // Guardar el nuevo arreglo en localStorage
    localStorage.setItem('scannedUIDs', JSON.stringify(scannedArray));
  }
  
  // Método para validar si el nombre de la sección del código QR coincide con la sección actual
  async validateSection(scanResult: string): Promise<boolean> {
    try {
      // Extraemos el nombre de la sección del código QR
      const scannedSeccionName = this.extractSeccionName(scanResult);
  
      // Compara el nombre de la sección escaneada con el nombre de la sección actual
      return scannedSeccionName === this.seccion?.uid;
    } catch (error) {
      console.error('Error al validar la sección:', error);
      return false;
    }
  }
  
  // Método para extraer el nombre de la sección desde el código QR
  extractSeccionName(scanResult: string): string {
    // Usamos una expresión regular para extraer el nombre de la sección del QR
    const regex = /Sección:\s*([^,]+)/;
    const match = scanResult.match(regex);
  
    if (match && match[1]) {
      return match[1].trim(); // Devuelve el nombre de la sección encontrado
    } else {
      console.error('No se pudo extraer el nombre de la sección del QR');
      return '';
    }
  }
  
  // Método para validar si la fecha del código QR coincide con la fecha actual
  validateDate(scanResult: string): boolean {
    const regexFecha = /Fecha:\s*([^,]+)/;
    const match = scanResult.match(regexFecha);
  
    if (match && match[1]) {
      const qrDate = match[1].trim(); // Fecha del QR
      const currentDate = new Date().toLocaleDateString(); // Fecha actual en formato local (día/mes/año)
      
      console.log('Fecha QR:', qrDate);  // Log para depurar
      console.log('Fecha actual:', currentDate);  // Log para depurar
  
      return qrDate === currentDate; // Compara las fechas
    } else {
      console.error('No se pudo extraer la fecha del QR');
      return false;
    }
  }

  // Método para validar si la posición del código QR está dentro del rango de 100 metros
  async validatePosition(scanResult: string): Promise<boolean> {
    try {
      const qrPosition = this.extractPosition(scanResult);
      if (!qrPosition) {
        console.error('No se pudo extraer la posición del QR');
        return false;
      }
  
      if (!this.latitude || !this.longitude) {
        console.error('No se obtuvo la ubicación actual');
        return false;
      }
  
      const distance = this.calculateDistance(
        this.latitude, this.longitude, qrPosition.latitude, qrPosition.longitude
      );
  
      return distance <= 100; // 100 metros
    } catch (error) {
      console.error('Error al validar la posición:', error);
      return false;
    }
  }

  // Método para extraer la posición (lat, lon, alt) del código QR
  extractPosition(scanResult: string): { latitude: number, longitude: number, altitude: number } {
    const regexPosition = /Ubicación:\s*([^,]+),\s*([^,]+),\s*([^,]+)/;
    const match = scanResult.match(regexPosition);
  
    if (match && match[1] && match[2] && match[3]) {
      return {
        latitude: parseFloat(match[1].trim()),
        longitude: parseFloat(match[2].trim()),
        altitude: parseFloat(match[3].trim()) // Altitud
      };
    } else {
      console.error('No se pudo extraer la ubicación del QR');
      return null;
    }
  }

  // Método para calcular la distancia entre dos puntos geográficos usando la fórmula de Haversine
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = lat1 * Math.PI / 180; // Latitud 1 en radianes
    const φ2 = lat2 * Math.PI / 180; // Latitud 2 en radianes
    const Δφ = (lat2 - lat1) * Math.PI / 180; // Diferencia de latitud en radianes
    const Δλ = (lon2 - lon1) * Math.PI / 180; // Diferencia de longitud en radianes
  
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return R * c; // Distancia en metros
  }


































  
/**
 * Registra la asistencia del estudiante para una sección específica.
 */
async registerAttendance(uidFromQR: string) {
  try {
    const isOnline = await this.utilsSvc.checkInternetConnection(); // Verificar si hay conexión
    const estudianteId = this.alumnoUid;

    if (isOnline) {
      // Modo online: Registrar directamente en Firebase
      const asistenciaExistente = await this.firebaseSvc.obtenerAsistenciaEstudiantePorSeccion(estudianteId, this.seccion?.uid);

      if (asistenciaExistente && asistenciaExistente.length > 0) {
        const asistencia = asistenciaExistente[0];
        const updatedTotal = (asistencia.total_asistencia || 0) + 1;
        await this.firebaseSvc.actualizarAsistencia(asistencia.id, updatedTotal);
      } else {
        const nuevoRegistroAsistencia = {
          estudiante_id: estudianteId,
          seccion_id: this.seccion?.uid,
          total_asistencia: 1,
        };
        await this.firebaseSvc.crearAsistencia(nuevoRegistroAsistencia);
      }
    } else {
      // Modo offline: Guardar en almacenamiento local
      const offlineAsistencia = {
        estudiante_id: estudianteId,
        seccion_id: this.seccion?.uid,
        total_asistencia: 1,
        timestamp: new Date().toISOString(), // Para futuras sincronizaciones
      };

      // Guardar asistencia en almacenamiento local
      let asistenciasOffline = (await this.localStorageSvc.get('asistencias_offline')) || [];
      asistenciasOffline.push(offlineAsistencia);
      await this.localStorageSvc.set('asistencias_offline', asistenciasOffline);

      this.utilsSvc.showToast('Asistencia registrada en modo offline.');
    }
  } catch (error) {
    console.error('Error al registrar asistencia:', error);
  }
}



















// Método que muestra el mensaje de confirmación para registrar la asistencia
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