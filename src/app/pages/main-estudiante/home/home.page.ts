import { Component, inject, OnInit } from '@angular/core';
import { IonRouterOutlet, MenuController } from '@ionic/angular';
import { AppComponent } from 'src/app/app.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Asignatura } from 'src/app/models/asignatura.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  localStorageSvc = inject(LocalStorageService);
  asignaturas: { asignatura: Asignatura; seccionId: string }[] = []; // Array modificado
  alumnoUid: string = ''; // Almacenaremos el UID del alumno aquí

  constructor(
    private router: Router,
    private appComponent: AppComponent,
    private menuCtrl: MenuController,
    private routerOutlet: IonRouterOutlet
  ) { }

  ngOnInit() {
    this.routerOutlet.swipeGesture = false; // Desactivar gestos en este componente
    this.menuCtrl.enable(true, 'menu-estudiante');
    this.loadAsignaturas();
    // Reinicia el menú después de cargar datos
    this.resetMenu();

    // Obtener el objeto completo del usuario desde localStorage
    const userData = localStorage.getItem('user');

    if (userData) {
      const user = JSON.parse(userData);
      this.alumnoUid = user.uid; // Guardar UID en la propiedad del componente
    }


  }


  // Método para reiniciar el menú
  resetMenu() {
    this.menuCtrl.enable(false, 'menu-estudiante'); // Desactiva el menú
    setTimeout(() => {
      this.menuCtrl.enable(true, 'menu-estudiante'); // Actívalo nuevamente
    }, 100); // Espera un breve momento
  }




  async loadAsignaturas() {
    const loading = await this.utilsSvc.loading();
    await loading.present();

    try {
      const hasInternet = await this.utilsSvc.checkInternetConnection();
      if (hasInternet) {
        console.log('Conexión a internet detectada. Cargando desde Firebase...');
        const uidEstudiante = this.alumnoUid; // UID del estudiante
        console.log('UID Estudiante:', uidEstudiante);

        if (uidEstudiante) {
          // Cargar asignaturas desde Firebase
          this.asignaturas = await this.firebaseSvc.getAsignaturasDeEstudiante(uidEstudiante);
          console.log('Asignaturas cargadas desde Firebase:', this.asignaturas);

          // Guardar asignaturas en localStorage
          this.localStorageSvc.set('asignaturas', this.asignaturas);
        } else {
          console.warn('No se encontró el UID del estudiante en localStorage.');
        }
      } else {
        console.warn('Sin conexión a internet. Cargando desde localStorage...');
        // Cargar asignaturas desde localStorage si no hay conexión
        const asignaturasGuardadas = this.localStorageSvc.get('asignaturas');
        if (asignaturasGuardadas) {
          this.asignaturas = asignaturasGuardadas;
          console.log('Asignaturas cargadas desde localStorage:', this.asignaturas);
        } else {
          console.warn('No hay asignaturas guardadas en localStorage.');
        }
      }
    } catch (error) {
      console.error('Error al cargar asignaturas:', error);
    } finally {
      loading.dismiss();
    }
  }

  abrirDetalleSeccion(seccionId: string) {
    console.log('ID de la sección:', seccionId);
    this.router.navigate(['/main-estudiante/ramos', seccionId]);
  }

}
