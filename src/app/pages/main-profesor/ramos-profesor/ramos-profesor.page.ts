import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Seccion } from 'src/app/models/seccion.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-ramos-profesor',
  templateUrl: './ramos-profesor.page.html',
  styleUrls: ['./ramos-profesor.page.scss'],
})
export class RamosProfesorPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  
  seccionId: string;
  seccion: Seccion | null = null; // Usar el modelo Seccion

  nombreAsignatura: string = '';
  profesorNombre: string = '';
  aula: string = 'xxx-x'; // Reemplaza con la lógica para obtener el aula si es necesario
  cantidadAlumnos: number = 0; // Variable para almacenar la cantidad de alumnos

  constructor(private router: Router, private route: ActivatedRoute, private menuCtrl: MenuController) {}

  ngOnInit() {
    this.seccionId = this.route.snapshot.paramMap.get('seccionId') || '';
    if (this.seccionId) {
      this.obtenerDatosSeccion(this.seccionId);
    } else {
      console.error('Sección ID no proporcionado');
    }
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  async obtenerDatosSeccion(id: string) {
    const loading = await this.utilsSvc.loading();
    await loading.present();
    try {
      // Obtener la sección
      this.seccion = await this.firebaseSvc.getSeccionPorId(id);
      if (this.seccion) {
        // Obtener la asignatura
        const asignatura = await this.firebaseSvc.getAsignaturaPorId(this.seccion.asignatura);
        if (asignatura) {
          this.nombreAsignatura = asignatura.nombre;
        }

        // Obtener el nombre del profesor
        this.profesorNombre = this.user().name + ' ' + this.user().lastname;
        this.aula = this.seccion.aula;

        // Contar la cantidad de alumnos en la sección
        await this.obtenerCantidadAlumnos(this.seccion.uid);
      }
    } catch (error) {
      console.error('Error obteniendo la sección:', error);
    }
    loading.dismiss();
  }

  async obtenerCantidadAlumnos(seccionId: string) {
    try {
      // Obtener los registros de alumnos en esta sección
      const alumnos = await this.firebaseSvc.getAlumnosPorSeccion(seccionId);
      this.cantidadAlumnos = alumnos.length; // El número de registros es el número de alumnos
    } catch (error) {
      console.error('Error obteniendo los alumnos:', error);
    }
  }















  
  Generar() {
    this.router.navigate(['/main-profesor/generar-profesor', this.seccionId]); // Navega a la página para generar el código QR
  }
  
  
  Lista() {
    this.router.navigate(['/main-profesor/lista-alumno', this.seccionId]); // Navega a la página para Visualizar los estudiantes
  }
  metodoEjemplo()
  {
    console.log("hola");
  }
}
