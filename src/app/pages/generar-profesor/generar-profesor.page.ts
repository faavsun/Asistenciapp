import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-generar-profesor',
  templateUrl: './generar-profesor.page.html',
  styleUrls: ['./generar-profesor.page.scss'],
})
export class GenerarProfesorPage implements OnInit {

  constructor(private router:Router,private alertController: AlertController) { }

  ngOnInit() {
  }


  //ver si sacar la opcion y dejar solo un OK
   async Finalizar() {
    const alert = await this.alertController.create({
      header: 'Registrar asistencia',
      message: 'Desea finalizar la toma de asistencia?',
      backdropDismiss:false,
      buttons: [ {
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
          
          this.navegar();
        },
      },],
    });

    await alert.present();
  }
  navegar()
  {
    this.router.navigate(['/home-profesor']);
  }
}
