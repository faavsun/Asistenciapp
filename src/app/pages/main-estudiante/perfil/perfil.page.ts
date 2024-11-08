import { Component, inject, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  firebaseSvc = inject(FirebaseService)
  utilsSvc = inject(UtilsService)
  

  constructor(private menuCtrl: MenuController){}

  ngOnInit() {
    //this.menuCtrl.enable(true); // Desactivar el menú en esta vista
  }

  user(): User{ 
    return this.utilsSvc.getFromLocalStorage('user');
  }

  cambio(){
    this.utilsSvc.routerLink('/main-estudiante/cambiar-clave')
  }
}
