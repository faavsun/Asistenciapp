import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-main-profesor',
  templateUrl: './main-profesor.page.html',
  styleUrls: ['./main-profesor.page.scss'],
})
export class MainProfesorPage implements OnInit {

  pages = [
    {title: 'Inicio', url: '/main-profesor/home-profesor', icon: 'home-outline'},
    {title: 'Perfil', url: '/main-profesor/perfil-profesor', icon: 'person-outline'},
    {title: 'ramos', url: '/main-profesor/ramos-profesor', icon: 'person-outline'},
    {title: 'generar', url: '/main-profesor/generar-profesor', icon: 'person-outline'},
    {title: 'lista', url: '/main-profesor/lista-alumno', icon: 'person-outline'},
    {title: 'cambiar', url: '/main-profesor/cambiar-clave-profesor', icon: 'person-outline'},
  ]

  router = inject(Router);
  firebaseSvc = inject(FirebaseService)
  utilsSvc = inject(UtilsService)
  currentPath: string = '';

  constructor(private menuCtrl: MenuController){}

  ngOnInit() {
   // this.menuCtrl.enable(true); // Desactivar el menú en esta vista
    this.router.events.subscribe((event: any) =>{
      if (event?.url) {
        this.currentPath = event.url;
      }
    })
  }









  

  //========== Cerrar sesión===============
signOut(){
  this.firebaseSvc.signOut();
 
}


}