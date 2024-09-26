import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  constructor(private router:Router,private menuCtrl: MenuController) { }

  ngOnInit() {
    this.menuCtrl.enable(true); // Desactivar el menú en esta vista
  }
  
  cambio(){
    this.router.navigate(['/cambiar-clave'])
  }
}
