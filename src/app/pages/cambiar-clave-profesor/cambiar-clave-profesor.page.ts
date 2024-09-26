import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-cambiar-clave-profesor',
  templateUrl: './cambiar-clave-profesor.page.html',
  styleUrls: ['./cambiar-clave-profesor.page.scss'],
})
export class CambiarClaveProfesorPage implements OnInit {


  constructor(private router:Router,private alertController: AlertController,private navCtrl: NavController,private menuCtrl: MenuController) { }

  ngOnInit() {
    this.menuCtrl.enable(true); // activar el menú en esta vista
  }
  async cambiarp() {
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