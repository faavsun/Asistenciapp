import { Component,inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-main-estudiante',
  templateUrl: './main-estudiante.page.html',
  styleUrls: ['./main-estudiante.page.scss'],
})
export class MainEstudiantePage implements OnInit {

  pages = [
    {title: 'Inicio', url: '/main-estudiante/home', icon: 'home-outline'},
    {title: 'Perfil', url: '/main-estudiante/perfil', icon: 'person-outline'},
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
