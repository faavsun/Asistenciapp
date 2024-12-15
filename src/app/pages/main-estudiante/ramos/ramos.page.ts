import { Component, inject, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Seccion } from 'src/app/models/seccion.model';
import { Asignatura } from 'src/app/models/asignatura.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-ramos',
  templateUrl: './ramos.page.html',
  styleUrls: ['./ramos.page.scss'],
})
export class RamosPage implements OnInit {
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  localStorageSvc = inject(LocalStorageService);
  seccionId: string | null = null;
  seccion: Seccion | null = null;
  profesor: User | null = null;
  asignatura: Asignatura | null = null;
  asistenciaData: any[] = [];
  userId: string = '';
  hasInternet: boolean = true; // Para controlar si hay conexión a internet
  dataCompleta: any = {}; // Contendrá todos los datos del home (cargados desde localStorage)
  dataCompletap: any = {};

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.menuCtrl.enable(true, 'menu-estudiante');
    this.seccionId = this.route.snapshot.paramMap.get('seccionId');
    console.log('ID de la sección:', this.seccionId);

    // Verificar la conexión a internet usando UtilsService
    this.hasInternet = await this.utilsSvc.checkInternetConnection();
    console.log('Conexión a internet:', this.hasInternet);

    // Obtener el ID del estudiante y cargar los datos completos del home desde localStorage
    const user = this.utilsSvc.getFromLocalStorage('user');
    this.userId = user ? user.uid : '';
    this.dataCompleta = this.localStorageSvc.get('dataCompleta') || {}; // Cargar los datos del home
    this.dataCompletap = this.localStorageSvc.get('datosoffline') || {}; // Cargar los datos del home

    if (this.seccionId) {
      await this.loadSeccionData(this.seccionId);
      await this.loadAsistenciaData(this.userId, this.seccionId);
    } else {
      console.error('Sección ID no proporcionado');
    }
  }

  private async loadSeccionData(seccionId: string) {
    const loading = await this.utilsSvc.loading();
    await loading.present();

    try {
      if (this.hasInternet) {
        // Cargar datos desde Firebase si hay internet
        const seccionFromFirebase = await this.firebaseSvc.getSeccionById(seccionId);
        if (seccionFromFirebase) {
          // Actualizar los datos con los de Firebase (si es necesario)
          this.seccion = seccionFromFirebase;
          // Guardar la sección en localStorage
          this.localStorageSvc.set('seccion_' + seccionId, this.seccion);
        } else {
          throw new Error(`Sección no encontrada en Firebase para el ID: ${seccionId}`);
        }
      } else {
        // Si no hay internet, cargar la sección desde localStorage
        console.warn(`No hay internet, cargando sección desde localStorage`);
        this.seccion = this.dataCompleta.secciones?.find((seccion: any) => seccion.uid === seccionId) || null;
        if (!this.seccion) {
          this.seccion = this.dataCompletap.secciones?.find((seccion: any) => seccion.uid === seccionId) || null;
          if (!this.seccion) {
            throw new Error(`Sección no encontrada en localStorage para el ID: ${seccionId}`);
          }
        }
      }

      console.log('Datos de la sección:', this.seccion);
      await this.loadAsignaturaAndProfesor(this.seccion?.asignatura, this.seccion?.profesor);
    } catch (error) {
      this.handleError(error);
    } finally {
      loading.dismiss();
    }
  }

  private async loadAsignaturaAndProfesor(asignaturaId: string | undefined, profesorId: string | undefined) {
    if (asignaturaId) {
      try {
        if (this.hasInternet) {
          // Cargar asignatura desde Firebase si hay internet
          this.asignatura = await this.firebaseSvc.getAsignaturaById(asignaturaId);
          if (!this.asignatura) throw new Error(`Asignatura no encontrada en Firebase para el ID: ${asignaturaId}`);

          // Guardar la asignatura en localStorage
          this.localStorageSvc.set('asignatura_' + asignaturaId, this.asignatura);
        } else {
          // Si no hay internet, cargar la asignatura desde localStorage
          console.warn(`No hay internet, cargando asignatura desde localStorage`);
          this.asignatura = this.dataCompleta.asignaturas?.find((asignatura: any) => asignatura.asignatura.uid === asignaturaId)?.asignatura || null;
          if (!this.asignatura) {
            this.asignatura = this.dataCompletap.asignaturas?.find((asignatura: any) => asignatura.uid === asignaturaId) || null;
            console.log('Datos de la asignatura yoooooooo:', this.asignatura);
            if (!this.asignatura) {
              throw new Error(`Asignatura no encontrada en localStorage para el ID: ${asignaturaId}`);
            }
          }
        }
        console.log('Datos de la asignatura:', this.asignatura);
      } catch (error) {
        console.error('Error cargando la asignatura:', error);
      }
    }


    if (profesorId) {
      try {
        let profesor;
        if (this.hasInternet) {
          // Cargar profesor desde Firebase si hay internet
          profesor = await this.firebaseSvc.getUserById(profesorId);
          console.log('Datos del profe:', profesor);
          if (!profesor) throw new Error(`Profesor no encontrado en Firebase para el ID: ${profesorId}`);

          // Guardar el profesor en localStorage
          this.localStorageSvc.set('user_' + profesorId, profesor);
        } else {
          // Si no hay internet, cargar el profesor desde localStorage
          console.warn(`No hay internet, cargando profesor desde localStorage`);
          this.profesor = this.dataCompleta.profesores?.find((users: any) => users.uid === this.seccion.profesor) || null;
          
          if (!this.profesor) {
            this.profesor = this.dataCompletap.alumnos?.find((users: any) => users.uid === this.seccion.profesor) || null;
            if (!this.profesor) {
              throw new Error(`Profesor no encontrado en localStorage para el ID: ${profesorId}`);
            }
          }
        }
        if (this.profesor) {
          this.seccion!.profesor = `${this.profesor.name} ${this.profesor.lastname}`;
          console.log('Datos del profesor:', this.seccion!.profesor);
        }
        if (profesor) {
          this.seccion!.profesor = `${profesor.name} ${profesor.lastname}`;
          console.log('Datos del profesor:', this.seccion!.profesor);
        }
      } catch (error) {
        console.error('Error cargando el profesor:', error);
      }
    }
  }

  private async loadAsistenciaData(estudianteId: string, seccionId: string) {
    try {
      if (this.hasInternet) {
        // Cargar asistencia desde Firebase si hay internet
        this.asistenciaData = await this.firebaseSvc.getAsistenciaPorEstudianteYSeccion(estudianteId, seccionId);
        if (!this.asistenciaData || this.asistenciaData.length === 0) {
          this.asistenciaData = [{ total_asistencia: 0 }];
        }

        // Guardar los datos de asistencia en localStorage
        this.localStorageSvc.set(`asistencia_${estudianteId}_${seccionId}`, this.asistenciaData);
      } else {
        // Si no hay internet, cargar asistencia desde localStorage
        console.warn(`No hay internet, cargando asistencia desde localStorage`);
        this.asistenciaData = this.localStorageSvc.get(`asistencia_${estudianteId}_${seccionId}`) || [{ total_asistencia: 0 }];
      }
      console.log('Datos de asistencia:', this.asistenciaData);
    } catch (error) {
      console.error('Error obteniendo los datos de asistencia:', error);
      this.asistenciaData = [{ total_asistencia: 0 }];
    }
  }

  private handleError(error: any) {
    console.error('Error al cargar los datos:', error);
  }

  Marcar() {
    console.log('Marcar asistencia');
    this.router.navigate(['/main-estudiante/marcar', this.seccionId]);
  }
}
