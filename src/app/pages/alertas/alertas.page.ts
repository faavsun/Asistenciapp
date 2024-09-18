import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.page.html',
  styleUrls: ['./alertas.page.scss'],
})
export class AlertasPage implements OnInit {

  texto:string="Texto de la alerta";
  alertButtons = [{
    text:'Aceptar',
    cssClass:'aceptar-style',
  }, {
    text:'Cancelar',
    cssClass:'danger-style',
  }];

  constructor(private alertController:AlertController, private router:Router) { }

  ngOnInit() {
    
  }


  async alerta(){
    const alert = await this.alertController.create({
      header: 'Alerta',
      subHeader: 'A Sub Header Is Optional',
      message: this.texto,
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
