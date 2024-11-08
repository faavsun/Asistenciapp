import { Component, inject, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-cambiar-clave',
  templateUrl: './cambiar-clave.page.html',
  styleUrls: ['./cambiar-clave.page.scss'],
})
export class CambiarClavePage implements OnInit {
  newPassword: string = ''; // Nueva contraseña del usuario

  firebaseSvc = inject(FirebaseService)
  utilsSvc = inject(UtilsService)

  constructor(private alertController: AlertController,private navCtrl: NavController,private menuCtrl: MenuController) { }

  ngOnInit() {
    //this.menuCtrl.enable(true); // activar el menú en esta vista
  }
  async cambiarp() {
    try {
      // Llama al método para cambiar la contraseña
      await this.firebaseSvc.updatePassword(this.newPassword);
      await this.presentAlert();
    } catch (error) {
      this.utilsSvc.showToast(error.message || "Error al cambiar la contraseña"); // Muestra el error en un toast
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Contraseña actualizada',
      message: 'Tu contraseña ha sido actualizada exitosamente.',
      buttons: [{
        text: 'OK',
        role: 'confirm',
        handler: () => {
          
          this.navegar();
        },
      },],
      backdropDismiss: false  //para que no se pulse fuera de la alerta
    });

    await alert.present();
  }
  
  navegar()
  {
    this.navCtrl.back();
  }
}