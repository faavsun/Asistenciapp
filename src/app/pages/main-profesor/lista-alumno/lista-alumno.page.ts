import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, MenuController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-lista-alumno',
  templateUrl: './lista-alumno.page.html',
  styleUrls: ['./lista-alumno.page.scss'],
})
export class ListaAlumnoPage implements OnInit {
  seccionId: string = '';
  estudiantes: Observable<any[]> | undefined; // Cambiado a 'any[]' para incluir los datos de asistencia.

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  constructor(private route: ActivatedRoute, private navCtrl: NavController, private menuCtrl: MenuController) {}

  ngOnInit() {
   // this.menuCtrl.enable(true); // Activar el menú en esta vista
    // Obtener el ID de la sección desde la ruta
    this.seccionId = this.route.snapshot.paramMap.get('seccionId') || '';
    console.log('ID de sección a buscar:', this.seccionId);
    if (this.seccionId) {
      this.getEstudiantes(this.seccionId);
    } else {
      console.error('Sección ID no proporcionado');
    }
  }

  goBack() {
    this.navCtrl.back(); // Navega a la vista anterior
  }










  
  getEstudiantes(seccionId: string) {
    this.estudiantes = this.firebaseSvc.getEstudiantesBySeccion(seccionId);
    this.estudiantes.subscribe(data => {
      console.log('Estudiantes con su asistencia y sección:', data); // Verifica los datos combinados
      console.table(data); // Muestra los datos en formato de tabla
    }, error => {
      console.error('Error al obtener estudiantes:', error); // Maneja errores
    });
  }





  
}
