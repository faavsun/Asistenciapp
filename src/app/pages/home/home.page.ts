import { Component, OnInit } from '@angular/core';
import { MenuItem } from '../../interfaces/menu-item';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {


  //es del menu lateral
  elementos: MenuItem[] = [
    {
      ruta: '/perfil',
      icono: 'person-outline',
      etiqueta: 'perfil'
    },
    {
      ruta: '/home',
      icono: 'reader-outline',
      etiqueta: 'Ramos'
    },
    {
      ruta: '/lanzamiento',
      icono: 'warning-outline',
      etiqueta: 'Cerrar sesion'
    }
  ]

  asignaturas:MenuItem[]=[
    {
      ruta:'/ramos',
      icono:'reader-outline',
      etiqueta:'Matemáticas'
    },
    {
      ruta:'/ramos',
      icono:'reader-outline',
      etiqueta:'Historia'
    },    
    {
      ruta:'/ramos',
      icono:'reader-outline',
      etiqueta:'Biología'
    },    
    {
      ruta:'/ramos',
      icono:'reader-outline',
      etiqueta:'Química'
    },    
    {
      ruta:'/ramos',
      icono:'reader-outline',
      etiqueta:'Inglés'
    },  
    {
      ruta:'/ramos',
      icono:'reader-outline',
      etiqueta:'Física'
    }
  
  ];






  constructor(private appComponent: AppComponent,private router: Router,private menuCtrl: MenuController ) { }


  ngOnInit() {
    this.appComponent.selectedMenuId = 'first';
    this.menuCtrl.enable(true); // Desactivar el menú en esta vista
  }

  metodoEjemplo() {
    console.log("hola");
  }
}
