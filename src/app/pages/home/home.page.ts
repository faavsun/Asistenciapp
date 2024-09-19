import { Component, OnInit } from '@angular/core';
import { MenuItem } from '../../interfaces/menu-item';
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
      etiqueta: 'Botones'
    },
    {
      ruta: '/alertas',
      icono: 'warning-outline',
      etiqueta: 'Alertas'
    },
    {
      ruta: '/formulario',
      icono: 'reader-outline',
      etiqueta: 'Formulario'
    },
    {
      ruta: '/action-sheet',
      icono: 'arrow-up',
      etiqueta: 'Action Sheets'
    }
  ]
  public actionSheetButtons = [
    {
      text: 'Borrara',
      role: 'destructive',
      data: {
        action: 'delete',
      },
    },
    {
      text: 'Formularios',
      handler: () => {
        this.router.navigate(['/repasoconceptos']);
        this.metodoEjemplo();
      },

      data: {
        action: 'share',
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
  constructor(private router: Router) { }

  ngOnInit() {
  }

  metodoEjemplo() {
    console.log("hola");
  }
}
