import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-asignatura-admin',
  templateUrl: './asignatura-admin.page.html',
  styleUrls: ['./asignatura-admin.page.scss'],
})
export class AsignaturaAdminPage implements OnInit {

  constructor(private router:Router,private alertController: AlertController,private navCtrl: NavController) { }

  ngOnInit() {
  }
  Generar() {
    this.router.navigate(['/generar-profesor'])
  }
  metodoEjemplo()
  {
    console.log("hola");
  }

 //ver si sacar la opcion y dejar solo un OK
 async Guardar() {
  const alert = await this.alertController.create({
    header: 'Esta seguro?',
    message: 'Confirma que los datos ingresados estan correctos',
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

goBack() {
  this.navCtrl.back(); // Navega a la vista anterior
}


}
