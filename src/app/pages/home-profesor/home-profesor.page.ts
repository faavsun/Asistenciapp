import { Component, OnInit } from '@angular/core';
import { MenuItem } from '../../interfaces/menu-item';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-profesor',
  templateUrl: './home-profesor.page.html',
  styleUrls: ['./home-profesor.page.scss'],
})
export class HomeProfesorPage implements OnInit {


  //es del menu lateral
  elementos:MenuItem[]=[
    {
      ruta:'/botones',
      icono:'radio-button-on-outline',
      etiqueta:'Perfil'
    },
    {
      ruta:'/alertas',
      icono:'warning-outline',
      etiqueta:'Alertas'
    },
    {
      ruta:'/home',
      icono:'reader-outline',
      etiqueta:'Ramos'
    },
    {
      ruta:'/login',
      icono:'warning-outline',
      etiqueta:'Cerrar sesion'
    }
  ]



  //es de la lista principal
  asignaturas:MenuItem[]=[
    {
      ruta:'/ramos-profesor',
      icono:'reader-outline',
      etiqueta:'Matemáticas'
    },
    {
      ruta:'/ramos-profesor',
      icono:'reader-outline',
      etiqueta:'Historia'
    },    
    {
      ruta:'/ramos-profesor',
      icono:'reader-outline',
      etiqueta:'Biología'
    },    
    {
      ruta:'/ramos-profesor',
      icono:'reader-outline',
      etiqueta:'Química'
    },    
    {
      ruta:'/ramos-profesor',
      icono:'reader-outline',
      etiqueta:'Inglés'
    },  
    {
      ruta:'/ramos-profesor',
      icono:'reader-outline',
      etiqueta:'Física'
    }
  
  ];






  constructor(private router:Router,private menuCtrl: MenuController ) { }

  ionViewWillLeave() {
    this.menuCtrl.close(); // Cerrar el menú cuando sale de la vista
  }


  ngOnInit() {
  }

  metodoEjemplo()
  {
    console.log("hola");
  }
}
