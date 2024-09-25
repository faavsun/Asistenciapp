import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-cambiar-clave',
  templateUrl: './cambiar-clave.page.html',
  styleUrls: ['./cambiar-clave.page.scss'],
})
export class CambiarClavePage implements OnInit {

  constructor(private router:Router,private alertController: AlertController,private navCtrl: NavController) { }

  ngOnInit() {
  }
  async cambiar() {
    await this.presentAlert();

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