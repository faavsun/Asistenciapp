import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-ramos-profesor',
  templateUrl: './ramos-profesor.page.html',
  styleUrls: ['./ramos-profesor.page.scss'],
})
export class RamosProfesorPage implements OnInit {


  constructor(private router:Router,private menuCtrl: MenuController) { }

  ngOnInit() {
    this.menuCtrl.enable(true); // Desactivar el menú en esta vista
  }
  Generar() {
    this.router.navigate(['/generar-profesor'])
  }
  Lista() {
    this.router.navigate(['/lista-alumno'])
  }
  metodoEjemplo()
  {
    console.log("hola");
  }
}
