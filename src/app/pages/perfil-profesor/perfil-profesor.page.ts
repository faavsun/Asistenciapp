import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-perfil-profesor',
  templateUrl: './perfil-profesor.page.html',
  styleUrls: ['./perfil-profesor.page.scss'],
})
export class PerfilProfesorPage implements OnInit {

  constructor(private router:Router,private menuCtrl: MenuController) { }

  ngOnInit() {
    this.menuCtrl.enable(true); // Desactivar el menú en esta vista
  }
  
  cambio(){
    this.router.navigate(['/cambiar-clave-profesor'])
  }
}
