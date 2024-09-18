import { Component, OnInit } from '@angular/core';
import { MenuItem } from '../../interfaces/menu-item';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  elementos:MenuItem[]=[
    {
      ruta:'/botones',
      icono:'radio-button-on-outline',
      etiqueta:'Botones'
    },
    {
      ruta:'/alertas',
      icono:'warning-outline',
      etiqueta:'Alertas'
    },
    {
      ruta:'/ramos',
      icono:'reader-outline',
      etiqueta:'Ramos'
    }
  ]





  public actionSheetButtons = [
    {
      text: 'Perfil',
      handler:()=>{
        this.router.navigate(['/repasoconceptos']); //para el perfil
        this.metodoEjemplo();
      },
      
      data: {
        action: 'share',
      },
    },
    {
      text: 'Cerrar sesion',
      role: 'destructive',
      handler:()=>{
        this.router.navigate(['/botones']); //aca es para cerrar la sesion
        this.metodoEjemplo();
      },
      data: {
        action: 'delete',
      },
    },
    {
      text: 'Cancelar',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];

  constructor(private router:Router) { }

  ngOnInit() {
  }

  metodoEjemplo()
  {
    console.log("hola");
  }
}
