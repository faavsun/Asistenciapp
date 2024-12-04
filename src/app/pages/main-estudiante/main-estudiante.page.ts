import { Component,inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { MenuController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-main-estudiante',
  templateUrl: './main-estudiante.page.html',
  styleUrls: ['./main-estudiante.page.scss'],
})
export class MainEstudiantePage implements OnInit {

  pages = [
    {title: 'Inicio', url: '/main-estudiante/home', icon: 'home-outline'},
    {title: 'Perfil', url: '/main-estudiante/perfil', icon: 'person-outline'},
    {title: 'Inscribir', url: '/main-estudiante/inscribir-seccion', icon: 'person-outline'},
  ]

  router = inject(Router);
  firebaseSvc = inject(FirebaseService)
  utilsSvc = inject(UtilsService)
  currentPath: string = '';

  constructor(private menuCtrl: MenuController, private alertController: AlertController){}

  ngOnInit() {
    this.menuCtrl.enable(true, 'menu-estudiante');
   // this.menuCtrl.enable(true); // Desactivar el menú en esta vista
    this.router.events.subscribe((event: any) =>{
      if (event?.url) {
        this.currentPath = event.url;
      }
    })
  }

  //========== Cerrar sesión===============
  async signOut() {
    const alert = await this.alertController.create({
      header: 'Cerrar sesión',
      message: 'Al cerrar sesión, los datos locales se eliminarán y solo podrá acceder nuevamente con conexión a internet. ¿Desea continuar?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cierre de sesión cancelado');
          },
        },
        {
          text: 'Cerrar sesión',
          role: 'confirm',
          handler: () => {
            // Llamamos al método signOut del servicio Firebase
            this.firebaseSvc.signOut();
          },
        },
      ],
    });

    await alert.present();
  }
}