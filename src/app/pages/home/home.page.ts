import { Component, OnInit } from '@angular/core';
import { MenuItem } from '../../interfaces/menu-item';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  elementos: MenuItem[] = [
    {
      ruta: '/perfil',
      icono: 'reader-outline',
      etiqueta: 'perfil'
    },
    {
      ruta: '/olvidada',
      icono: 'reader-outline',
      etiqueta: 'olvidada'
    },
    {
      ruta: '/lanzamiento',
      icono: 'reader-outline',
      etiqueta: 'Lanzamiento'
    },
    {
      ruta: '/registro',
      icono: 'reader-outline',
      etiqueta: 'Registro'
    },
    {
      ruta: '/botones',
      icono: 'radio-button-on-outline',
      etiqueta: 'Perfil'
    },
    {
      ruta: '/alertas',
      icono: 'warning-outline',
      etiqueta: 'Alertas'
    },
    {
      ruta: '/home',
      icono: 'reader-outline',
      etiqueta: 'Ramos'
    },
    {
      ruta: '/login',
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






  constructor(private router: Router,private menuCtrl: MenuController ) { }

  ionViewWillLeave() {
    this.menuCtrl.close(); // Cerrar el menú cuando sale de la vista
  }


  ngOnInit() {
  }

  metodoEjemplo() {
    console.log("hola");
  }
}
