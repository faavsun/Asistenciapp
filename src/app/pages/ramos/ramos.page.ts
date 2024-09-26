import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-ramos',
  templateUrl: './ramos.page.html',
  styleUrls: ['./ramos.page.scss'],
})
export class RamosPage implements OnInit {






  

  constructor(private router:Router,private menuCtrl: MenuController) { }

  ngOnInit() {
    this.menuCtrl.enable(true); // Desactivar el menú en esta vista
  }
  Marcar() {
    this.router.navigate(['/marcar'])
  }
  metodoEjemplo()
  {
    console.log("hola");
  }
}
