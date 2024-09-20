import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-ramos-admin',
  templateUrl: './ramos-admin.page.html',
  styleUrls: ['./ramos-admin.page.scss'],
})
export class RamosAdminPage implements OnInit {

  constructor(private router:Router,private alertController: AlertController) { }

  ngOnInit() {
  }
  Editar() {
    this.router.navigate(['/asignatura-editar-admin'])
  }
  metodoEjemplo()
  {
    console.log("hola");
  }

 //ver si sacar la opcion y dejar solo un OK
 async Deshabilitar() {
  const alert = await this.alertController.create({
    header: 'Esta seguro?',
    message: 'La asignatura quedara deshabilitada',
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
  this.router.navigate(['/home-admin']);
}


}
