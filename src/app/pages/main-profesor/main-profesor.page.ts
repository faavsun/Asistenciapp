import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { MenuController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-main-profesor',
  templateUrl: './main-profesor.page.html',
  styleUrls: ['./main-profesor.page.scss'],
})
export class MainProfesorPage implements OnInit {

  pages = [
    { title: 'Inicio', url: '/main-profesor/home-profesor', icon: 'home-outline' },
    { title: 'Perfil', url: '/main-profesor/perfil-profesor', icon: 'person-outline' },
    { title: 'Crear asignatura', url: '/main-profesor/crear-asignatura', icon: 'create-outline' },
    { title: 'Crear seccion', url: '/main-profesor/crear-seccion', icon: 'document-text-outline' },
  ]

  router = inject(Router);
  firebaseSvc = inject(FirebaseService)
  utilsSvc = inject(UtilsService)
  currentPath: string = '';

  constructor(private menuCtrl: MenuController, private alertController: AlertController) { }

  ngOnInit() {
    this.menuCtrl.enable(true, 'menu-profesor');
    // this.menuCtrl.enable(true); // Desactivar el menú en esta vista
    this.router.events.subscribe((event: any) => {
      if (event?.url) {
        this.currentPath = event.url;
      }
    })
  }











  //========== Cerrar sesión===============
  async signOut() {
    const alert = await this.alertController.create({
      header: 'Cerrar sesión',
      message: '¿Esta seguro que desea cerrar la sesion?',
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


