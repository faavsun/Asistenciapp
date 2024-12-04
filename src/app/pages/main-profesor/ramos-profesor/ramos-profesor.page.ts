import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Seccion } from 'src/app/models/seccion.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-ramos-profesor',
  templateUrl: './ramos-profesor.page.html',
  styleUrls: ['./ramos-profesor.page.scss'],
})
export class RamosProfesorPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  localStorageSvc = inject(LocalStorageService);
  
  seccionId: string = '';
  seccion: Seccion | null = null; 

  nombreAsignatura: string = '';
  profesorNombre: string = '';
  aula: string = 'xxx-x'; 
  cantidadAlumnos: number = 0; 

  hasInternet: boolean = true; // Para verificar la conexión a internet

  constructor(private router: Router, private route: ActivatedRoute, private menuCtrl: MenuController) {}

  async ngOnInit() {
    this.seccionId = this.route.snapshot.paramMap.get('seccionId') || '';
    if (this.seccionId) {
      // Verificar conexión a internet
      this.hasInternet = await this.utilsSvc.checkInternetConnection();
      console.log('Conexión a internet:', this.hasInternet);

      await this.obtenerDatosSeccion(this.seccionId);
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
      if (this.hasInternet) {
        // Obtener la sección desde Firebase
        this.seccion = await this.firebaseSvc.getSeccionPorId(id);
        if (this.seccion) {
          // Guardar la sección en el almacenamiento local
          this.localStorageSvc.set('seccion_' + id, this.seccion);

          // Obtener y guardar asignatura
          const asignatura = await this.firebaseSvc.getAsignaturaPorId(this.seccion.asignatura);
          if (asignatura) {
            this.nombreAsignatura = asignatura.nombre;
            this.localStorageSvc.set('asignatura_' + this.seccion.asignatura, asignatura);
          }

          // Configurar datos del profesor
          this.profesorNombre = this.user().name + ' ' + this.user().lastname;
          this.aula = this.seccion.aula;

          // Obtener y guardar la cantidad de alumnos
          await this.obtenerCantidadAlumnos(this.seccion.uid);
        }
      } else {
        // Cargar la sección desde almacenamiento local
        console.warn('No hay internet, cargando datos desde localStorage');
        this.seccion = this.localStorageSvc.get('seccion_' + id);
        if (this.seccion) {
          const asignatura = this.localStorageSvc.get('asignatura_' + this.seccion.asignatura);
          if (asignatura) {
            this.nombreAsignatura = asignatura.nombre;
          }
          this.profesorNombre = this.user().name + ' ' + this.user().lastname;
          this.aula = this.seccion.aula;

          // Obtener la cantidad de alumnos desde almacenamiento local
          const alumnos = this.localStorageSvc.get('alumnos_seccion_' + this.seccion.uid) || [];
          this.cantidadAlumnos = alumnos.length;
        } else {
          console.error('Datos de la sección no encontrados en localStorage');
        }
      }
    } catch (error) {
      console.error('Error obteniendo los datos de la sección:', error);
    }

    loading.dismiss();
  }

  async obtenerCantidadAlumnos(seccionId: string) {
    try {
      if (this.hasInternet) {
        const alumnos = await this.firebaseSvc.getAlumnosPorSeccion(seccionId);
        this.cantidadAlumnos = alumnos.length;

        // Guardar la lista de alumnos en el almacenamiento local
        this.localStorageSvc.set('alumnos_seccion_' + seccionId, alumnos);
      } else {
        const alumnos = this.localStorageSvc.get('alumnos_seccion_' + seccionId) || [];
        this.cantidadAlumnos = alumnos.length;
      }
    } catch (error) {
      console.error('Error obteniendo los alumnos:', error);
    }
  }

  Generar() {
    this.router.navigate(['/main-profesor/generar-profesor', this.seccionId]); 
  }

  Lista() {
    this.router.navigate(['/main-profesor/lista-alumno', this.seccionId]); 
  }

  metodoEjemplo() {
    console.log("hola");
  }
}
