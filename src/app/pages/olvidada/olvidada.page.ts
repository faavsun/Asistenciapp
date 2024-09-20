import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-olvidada',
  templateUrl: './olvidada.page.html',
  styleUrls: ['./olvidada.page.scss'],
})
export class OlvidadaPage implements OnInit {

  constructor(private router:Router,private alertController: AlertController) { }

  ngOnInit() {
  }
  async olvidada() {
    await this.presentAlert();

  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Correo enviado',
      message: 'Se ha enviado un correo para recuperar tu contraseña.',
      buttons: [{
        text: 'OK',
        role: 'confirm',
        handler: () => {
          
          this.navegar();
        },
      },],
    });

    await alert.present();
  }
  
  navegar()
  {
    this.router.navigate(['/lanzamiento'])
  }
}