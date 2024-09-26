import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-marcar',
  templateUrl: './marcar.page.html',
  styleUrls: ['./marcar.page.scss'],
})
export class MarcarPage implements OnInit {

  constructor(private router:Router,private alertController: AlertController,private menuCtrl: MenuController) { }

  ngOnInit() {
    this.menuCtrl.enable(true); // Desactivar el menú en esta vista
  }


  //ver si sacar la opcion y dejar solo un OK
   async Marcar() {
    const alert = await this.alertController.create({
      header: 'Registrar asistencia',
      message: 'Acepta resgistro de asistencia?',
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
    this.router.navigate(['/home']);
  }
}
