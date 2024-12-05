import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  
  constructor(private menu: MenuController,private firebaseSvc: FirebaseService) {
    this.initializeApp();
  }

  initializeApp() {
    this.monitorConnection();
  }


  monitorConnection() {
    Network.addListener('networkStatusChange', async status => {
      if (status.connected) {
        console.log('Conexión restaurada. Sincronizando offline...');
        await this.firebaseSvc.syncOfflineAttendance();
        await this.firebaseSvc.syncOfflineAsignaturas();
        await this.firebaseSvc.syncOfflineSecciones();
        await this.firebaseSvc.sincronizarInscripciones();
      }
    });
  }


  CloseMenu() {
    this.menu.close(); // Cerrar el menú cuando sale de la vista
  }
}
