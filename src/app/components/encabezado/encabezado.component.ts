import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'src/app/interfaces/menu-item';

@Component({
  selector: 'app-encabezado',
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.scss'],
})
export class EncabezadoComponent  implements OnInit {
  

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



  @Input() titulo="";
  constructor() { }

  ngOnInit() {}

}
