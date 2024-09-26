import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  aceptaTerminos = false;
  constructor(private router:Router,private menuCtrl: MenuController,private navCtrl: NavController) { }

  ngOnInit() {
    this.menuCtrl.enable(false); // Desactivar el menú en esta vista
  }


  Registrarse() {
    this.router.navigate(['/login'])
  }

  goBack() {
    this.navCtrl.back(); // Navega a la vista anterior
  }
}
