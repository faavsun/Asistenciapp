import { Component, inject, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Seccion } from 'src/app/models/seccion.model';
import { Asignatura } from 'src/app/models/asignatura.model';

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
  asignatura: Asignatura | null = null;
  asistenciaData: any[] = [];
  userId: string = '';
  hasInternet: boolean = true; // Para controlar si hay conexión a internet

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.menuCtrl.enable(true, 'menu-estudiante');
    this.seccionId = this.route.snapshot.paramMap.get('seccionId');
    console.log('ID de la sección:', this.seccionId);

    // Verificar la conexión a internet usando UtilsService
    this.hasInternet = await this.utilsSvc.checkInternetConnection();
    console.log('Conexión a internet:', this.hasInternet);

    // Obtener el ID del estudiante
    const user = this.utilsSvc.getFromLocalStorage('user');
    this.userId = user ? user.uid : '';

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
        // Cargar datos desde Firebase
        this.seccion = await this.firebaseSvc.getSeccionById(seccionId);
        if (!this.seccion) throw new Error(`Sección no encontrada en Firebase para el ID: ${seccionId}`);
        
        // Guardar los datos en localStorage si hay conexión
        this.localStorageSvc.set('seccion_' + seccionId, this.seccion);
      } else {
        // Cargar datos desde localStorage
        console.warn(`No hay internet, cargando sección desde localStorage`);
        this.seccion = this.localStorageSvc.get('seccion_' + seccionId);
        if (!this.seccion) throw new Error(`Sección no encontrada en localStorage para el ID: ${seccionId}`);
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
          // Cargar asignatura desde Firebase
          this.asignatura = await this.firebaseSvc.getAsignaturaById(asignaturaId);
          if (!this.asignatura) throw new Error(`Asignatura no encontrada en Firebase para el ID: ${asignaturaId}`);
          
          // Guardar la asignatura en localStorage si hay conexión
          this.localStorageSvc.set('asignatura_' + asignaturaId, this.asignatura);
        } else {
          // Cargar asignatura desde localStorage
          console.warn(`No hay internet, cargando asignatura desde localStorage`);
          this.asignatura = this.localStorageSvc.get('asignatura_' + asignaturaId);
          if (!this.asignatura) throw new Error(`Asignatura no encontrada en localStorage para el ID: ${asignaturaId}`);
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
          // Cargar profesor desde Firebase
          profesor = await this.firebaseSvc.getUserById(profesorId);
          if (!profesor) throw new Error(`Profesor no encontrado en Firebase para el ID: ${profesorId}`);
          
          // Guardar el profesor en localStorage si hay conexión
          this.localStorageSvc.set('user_' + profesorId, profesor);
        } else {
          // Cargar profesor desde localStorage
          console.warn(`No hay internet, cargando profesor desde localStorage`);
          profesor = this.localStorageSvc.get('user_' + profesorId);
          if (!profesor) throw new Error(`Profesor no encontrado en localStorage para el ID: ${profesorId}`);
        }
        if (profesor) {
          this.seccion!.profesor = `${profesor.name} ${profesor.lastname}`;
          console.log('Datos del profesor:', profesor);
        }
      } catch (error) {
        console.error('Error cargando el profesor:', error);
      }
    }
  }

  private async loadAsistenciaData(estudianteId: string, seccionId: string) {
    try {
      if (this.hasInternet) {
        // Cargar asistencia desde Firebase
        this.asistenciaData = await this.firebaseSvc.getAsistenciaPorEstudianteYSeccion(estudianteId, seccionId);
        if (!this.asistenciaData || this.asistenciaData.length === 0) {
          this.asistenciaData = [{ total_asistencia: 0 }];
        }
        
        // Guardar los datos de asistencia en localStorage si hay conexión
        this.localStorageSvc.set(`asistencia_${estudianteId}_${seccionId}`, this.asistenciaData);
      } else {
        // Cargar asistencia desde localStorage
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
