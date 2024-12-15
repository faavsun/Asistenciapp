import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Network } from '@capacitor/network';
import { UtilsService } from './services/utils.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  private isSyncInProgress = false; // Flag para controlar la sincronización
  private lastConnectionStatus: boolean | null = null; // Estado previo de conexión

  constructor(
    private menu: MenuController,
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.monitorConnection(); // Configura el monitoreo de conexión
  }

  // Método para monitorear la conexión de red y sincronizar una vez al reconectar
  monitorConnection() {
    Network.addListener('networkStatusChange', async status => {
      console.log('Estado de red detectado:', status.connected);

      // Verifica si pasó de offline a online y si no hay una sincronización en curso
      if (status.connected && this.lastConnectionStatus === false && !this.isSyncInProgress) {
        console.log('Conexión restaurada. Iniciando sincronización...');
        this.isSyncInProgress = true; // Bloquea sincronizaciones adicionales
        try {
          await this.sincronizarDatosOffline(); // Ejecuta sincronización
        } catch (error) {
          console.error('Error durante la sincronización:', error);
        } finally {
          this.isSyncInProgress = false; // Libera el flag tras completar
        }
      }

      // Actualiza el estado previo de conexión
      this.lastConnectionStatus = status.connected;
    });
  }

  // Método que sincroniza las inscripciones offline con Firebase de forma secuencial
  async sincronizarDatosOffline() {
    console.log('Iniciando sincronización de datos offline...');
    try {
      // Sincroniza las inscripciones offline de forma secuencial
      await this.firebaseSvc.sincronizarInscripciones();
      console.log('Sincronización de inscripciones completada.');

      await this.firebaseSvc.syncOfflineAttendance();
      console.log('Sincronización de asistencias completada.');

      await this.firebaseSvc.syncOfflineAsignaturas();
      console.log('Sincronización de asignaturas completada.');

      await this.firebaseSvc.syncOfflineSecciones();
      console.log('Sincronización de secciones completada.');

      this.utilsSvc.presentToast({
        message: 'Datos sincronizados correctamente con la nube.',
        duration: 2000,
        color: 'success',
        position: 'bottom',
        icon: 'cloud-done-outline'
      });

      // Recarga la página después de un éxito
      setTimeout(() => {
        location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error al sincronizar los datos offline:', error);
      this.utilsSvc.presentToast({
        message: 'Error al sincronizar los datos. Intenta nuevamente.',
        duration: 2000,
        color: 'danger',
        position: 'bottom',
        icon: 'cloud-offline-outline'
      });
    }
  }

  // Método para cerrar el menú lateral
  closeMenu() {
    this.menu.close();
  }
}
