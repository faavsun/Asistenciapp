import { Component, OnInit } from '@angular/core';
import { MenuItem } from '../../interfaces/menu-item';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';


interface Asignatura {
  ruta: string;
  icono: string;
  etiqueta: string;
  secciones: string[];
}



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
      ruta:'/home-profesor',
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
  asignaturas: Asignatura[] = [
    {
      ruta: '/ramos-profesor',
      icono: 'reader-outline',
      etiqueta: 'Matemáticas',
      secciones: ['Álgebra', 'Geometría', 'Cálculo']
    },
    {
      ruta: '/ramos-profesor',
      icono: 'reader-outline',
      etiqueta: 'Literatura',
      secciones: ['Poesía', 'Narrativa', 'Ensayo']
    },
    {
      ruta: '/ramos-profesor',
      icono: 'reader-outline',
      etiqueta: 'Arte',
      secciones: ['Historia del Arte', 'Técnicas de Pintura', 'Escultura']
    },
    {
      ruta: '/ramos-profesor',
      icono: 'reader-outline',
      etiqueta: 'Geografía',
      secciones: ['Geografía Física', 'Geografía Humana', 'Cartografía']
    },
    {
      ruta: '/ramos-profesor',
      icono: 'reader-outline',
      etiqueta: 'Economía',
      secciones: ['Microeconomía', 'Macroeconomía', 'Economía Internacional']
    },
    {
      ruta: '/ramos-profesor',
      icono: 'reader-outline',
      etiqueta: 'Informática',
      secciones: ['Programación', 'Redes', 'Bases de Datos']
    },
    {
      ruta: '/ramos-profesor',
      icono: 'reader-outline',
      etiqueta: 'Música',
      secciones: ['Teoría Musical', 'Historia de la Música', 'Práctica Instrumental']
    },
    {
      ruta: '/ramos-profesor',
      icono: 'reader-outline',
      etiqueta: 'Filosofía',
      secciones: ['Ética', 'Lógica', 'Metafísica']
    },
    {
      ruta: '/ramos-profesor',
      icono: 'reader-outline',
      etiqueta: 'Sociología',
      secciones: ['Teoría Sociológica', 'Métodos de Investigación', 'Estudios de Caso']
    },
    {
      ruta: '/ramos-profesor',
      icono: 'reader-outline',
      etiqueta: 'Política',
      secciones: ['Teoría Política', 'Historia Política', 'Políticas Públicas']
    },
    {
      ruta: '/ramos-profesor',
      icono: 'reader-outline',
      etiqueta: 'Antropología',
      secciones: ['Antropología Cultural', 'Antropología Física', 'Antropología Social']
    },
    {
      ruta: '/ramos-profesor',
      icono: 'reader-outline',
      etiqueta: 'Psicología',
      secciones: ['Psicología Cognitiva', 'Psicología Social', 'Psicopatología']
    },
    {
      ruta: '/ramos-profesor',
      icono: 'reader-outline',
      etiqueta: 'Derecho',
      secciones: ['Derecho Penal', 'Derecho Civil', 'Derecho Internacional']
    },
    {
      ruta: '/ramos-profesor',
      icono: 'reader-outline',
      etiqueta: 'Ingeniería',
      secciones: ['Ingeniería Civil', 'Ingeniería Electrónica', 'Ingeniería Mecánica']
    },
    {
      ruta: '/ramos-profesor',
      icono: 'reader-outline',
      etiqueta: 'Biología',
      secciones: ['Botánica', 'Zoología', 'Genética']
    },
    {
      ruta: '/ramos-profesor',
      icono: 'reader-outline',
      etiqueta: 'Química',
      secciones: ['Química Orgánica', 'Química Inorgánica', 'Bioquímica']
    },
    {
      ruta: '/ramos-profesor',
      icono: 'reader-outline',
      etiqueta: 'Inglés',
      secciones: ['Gramática', 'Conversación', 'Escritura']
    },
    {
      ruta: '/ramos-profesor',
      icono: 'reader-outline',
      etiqueta: 'Física',
      secciones: ['Mecánica', 'Termodinámica', 'Electromagnetismo']
    }
  ];



  constructor(private router:Router,private menuCtrl: MenuController ) { }

 
  abrirSeccion(seccion: string) {
    console.log(`Abriendo la sección: ${seccion}`);
    // Aquí puedes manejar la lógica de navegación o abrir una vista específica para la sección seleccionada.
  }

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
