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


















  // Método para registrar la asistencia
  async registerAttendance(uidFromQR: string) {
    try {
      // Obtener el UID del estudiante (esto dependerá de cómo se almacena el UID en el QR)
      const estudianteId = localStorage.getItem('userUid');
      
      // Verificar si ya existe un registro de asistencia para este estudiante y esta sección
      const asistenciaExistente = await this.firebaseSvc.obtenerAsistenciaEstudiantePorSeccion(estudianteId, this.seccion?.uid);
  
      if (asistenciaExistente && asistenciaExistente.length > 0) {
        // Si existe un registro de asistencia, lo actualizamos
        const asistencia = asistenciaExistente[0]; // Tomamos el primer registro (ya que asumimos que es único)
        const updatedTotal = (asistencia.total_asistencia || 0) + 1;
        
        console.log('ID del documento:', asistencia.id);  // Aquí puedes ver el ID del documento
        await this.firebaseSvc.actualizarAsistencia(asistencia.id, updatedTotal); // Ahora usamos 'asistencia.id'
        console.log('Asistencia actualizada con éxito');
      } else {
        // Si no existe un registro, lo creamos
        const nuevoRegistroAsistencia = {
          estudiante_id: estudianteId,
          seccion_id: this.seccion?.uid,
          total_asistencia: 1
        };
        await this.firebaseSvc.crearAsistencia(nuevoRegistroAsistencia);
        console.log('Nuevo registro de asistencia creado con éxito');
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