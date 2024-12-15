import { Component, inject, OnInit } from '@angular/core';
import { IonRouterOutlet, MenuController } from '@ionic/angular';
import { AppComponent } from 'src/app/app.component';
import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Asignatura } from 'src/app/models/asignatura.model';
import { Seccion } from 'src/app/models/seccion.model';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage.service'; // Importar LocalStorageService

@Component({
  selector: 'app-home-profesor',
  templateUrl: './home-profesor.page.html',
  styleUrls: ['./home-profesor.page.scss'],
})
export class HomeProfesorPage implements OnInit {
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  asignaturas: Asignatura[] = [];
  seccionesPorAsignatura: { [key: string]: Seccion[] } = {};
  nombreprofe: string = '';
  localStorageSvc = inject(LocalStorageService); // Inyectar LocalStorageService

  constructor(
    private router: Router,
    private appComponent: AppComponent,
    private menuCtrl: MenuController,
    private routerOutlet: IonRouterOutlet
  ) { }

  async ngOnInit() {
    this.routerOutlet.swipeGesture = false; // Desactivar gestos en este componente

    const user = this.user();
    if (user && user.uid) {
      try {
        // Cargar datos desde localStorage si no hay conexión
        const isOnline = await this.utilsSvc.checkInternetConnection();
        if (isOnline) {
          await this.cargarDatosDesdeFirebase(user.uid);
        } else {
          this.cargarDatosDesdeLocalStorage();
        }
      } catch (error) {
        console.error('Error al inicializar la página del profesor:', error);
      }
    } else {
      console.error('El UID del profesor no está disponible.');
      this.firebaseSvc.resetUserData();
    }
    this.menuCtrl.enable(true, 'menu-profesor');
    // Reinicia el menú después de cargar datos
    this.resetMenu();
  }



  // Método para reiniciar el menú
  resetMenu() {
    this.menuCtrl.enable(false, 'menu-profesor'); // Desactiva el menú
    setTimeout(() => {
      this.menuCtrl.enable(true, 'menu-profesor'); // Actívalo nuevamente
    }, 100); // Tiempo de espera breve para asegurarse de que se reinicia correctamente
  }




  async cargarDatosDesdeFirebase(profesorUid: string) {
    const loading = await this.utilsSvc.loading();
    await loading.present();

    try {
      // Obtener datos del profesor
      const userData = await this.firebaseSvc.getProfesorNombre(profesorUid);
      this.nombreprofe = userData.name + ' ' + userData.lastname;

      // Obtener asignaturas del profesor
      const asignaturas = await this.firebaseSvc.getAsignaturasPorProfesor(profesorUid);
      this.asignaturas = asignaturas;
      const secciones = await this.firebaseSvc.getAllSecciones();
      // Obtener secciones para cada asignatura
      for (const asignatura of this.asignaturas) {
        this.seccionesPorAsignatura[asignatura.uid] = secciones.filter(
          (seccion) => seccion.asignatura === asignatura.uid && seccion.profesor === this.user().uid
        );
      }

      // Guardar los datos en localStorage
      this.localStorageSvc.set('asignaturasProfesor', this.asignaturas);
      this.localStorageSvc.set('seccionesPorAsignatura', this.seccionesPorAsignatura);
      this.localStorageSvc.set('nombreProfesor', this.nombreprofe);
    } catch (error) {
      console.error('Error al cargar datos desde Firebase:', error);
    } finally {
      loading.dismiss();
    }
  }

  cargarDatosDesdeLocalStorage() {
    this.asignaturas = this.localStorageSvc.get('asignaturasProfesor') || [];
    this.seccionesPorAsignatura = this.localStorageSvc.get('seccionesPorAsignatura') || {};
    this.nombreprofe = this.localStorageSvc.get('nombreProfesor') || '';
  }



  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  abrirDetalleSeccion(seccionId: string) {
    console.log('ID de la sección:', seccionId);
    this.router.navigate(['/main-profesor/ramos-profesor', seccionId]);
  }
}
