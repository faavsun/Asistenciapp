import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AppComponent } from 'src/app/app.component';
import { MenuItem } from 'src/app/interfaces/menu-item';


interface estudiantes {
  ruta: string;
  icono: string;
  etiqueta: string;
  asitencia: number;
}


@Component({
  selector: 'app-lista-alumno',
  templateUrl: './lista-alumno.page.html',
  styleUrls: ['./lista-alumno.page.scss'],
})
export class ListaAlumnoPage implements OnInit {

  alumnos: estudiantes[] = [
    {
      ruta: '/ramos',
      icono: 'person-circle-outline',
      etiqueta: 'Juan Pérez',
      asitencia: 70
    },
    {
      ruta: '/ramos',
      icono: 'person-circle-outline',
      etiqueta: 'María López',
      asitencia: 56
    },
    {
      ruta: '/ramos',
      icono: 'person-circle-outline',
      etiqueta: 'Carlos Ramírez',
      asitencia: 70
    },
    {
      ruta: '/ramos',
      icono: 'person-circle-outline',
      etiqueta: 'Ana Fernández',
      asitencia: 70
    },
    {
      ruta: '/ramos',
      icono: 'person-circle-outline',
      etiqueta: 'Luis Gómez',
      asitencia: 98
    },
    {
      ruta: '/ramos',
      icono: 'person-circle-outline',
      etiqueta: 'Sofía Martínez',
      asitencia: 70
    },
    {
      ruta: '/ramos',
      icono: 'person-circle-outline',
      etiqueta: 'Jorge Castillo',
      asitencia: 70
    },
    {
      ruta: '/ramos',
      icono: 'person-circle-outline',
      etiqueta: 'Paula Torres',
      asitencia: 70
    },
    {
      ruta: '/ramos',
      icono: 'person-circle-outline',
      etiqueta: 'Fernando Reyes',
      asitencia: 70
    },
    {
      ruta: '/ramos',
      icono: 'person-circle-outline',
      etiqueta: 'Carmen Herrera',
      asitencia: 77
    },
    {
      ruta: '/ramos',
      icono: 'person-circle-outline',
      etiqueta: 'Pedro Rojas',
      asitencia: 70
    },
    {
      ruta: '/ramos',
      icono: 'person-circle-outline',
      etiqueta: 'Valeria Cruz',
      asitencia: 70
    },
    {
      ruta: '/ramos',
      icono: 'person-circle-outline',
      etiqueta: 'Manuel Díaz',
      asitencia: 60
    },
    {
      ruta: '/ramos',
      icono: 'person-circle-outline',
      etiqueta: 'Mónica Figueroa',
      asitencia: 70
    },
    {
      ruta: '/ramos',
      icono: 'person-circle-outline',
      etiqueta: 'Rodrigo Peña',
      asitencia: 70
    },
    {
      ruta: '/ramos',
      icono: 'person-circle-outline',
      etiqueta: 'Gabriela Soto',
      asitencia: 70
    },
    {
      ruta: '/ramos',
      icono: 'person-circle-outline',
      etiqueta: 'Ricardo Paredes',
      asitencia: 70
    },
    {
      ruta: '/ramos',
      icono: 'person-circle-outline',
      etiqueta: 'Laura Vega',
      asitencia: 50
    },
    {
      ruta: '/ramos',
      icono: 'person-circle-outline',
      etiqueta: 'David Flores',
      asitencia: 30
    },
    {
      ruta: '/ramos',
      icono: 'person-circle-outline',
      etiqueta: 'Daniela Mora',
      asitencia: 80
    }
  ];

  constructor(private navCtrl: NavController,private appComponent: AppComponent) { }



  //poner esto
  ngOnInit() {
    this.appComponent.selectedMenuId = 'profesor-menu';
  }


  goBack() {
    this.navCtrl.back(); // Navega a la vista anterior
  }
}
