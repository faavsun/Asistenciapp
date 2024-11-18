import { Component, inject, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AppComponent } from 'src/app/app.component';
import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Asignatura } from 'src/app/models/asignatura.model';
import { Seccion } from 'src/app/models/seccion.model';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';

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


  constructor(private router: Router, private appComponent: AppComponent, private menuCtrl: MenuController) { }

  // Función que obtiene todas las asignaturas asociadas al profesor
  async obtenerTodasLasAsignaturas(profesorUid: string) {
    const loading = await this.utilsSvc.loading();
    await loading.present();

    try {
      const asignaturas = await this.firebaseSvc.getAsignaturasPorProfesor(profesorUid); // Modificación aquí
      this.asignaturas = asignaturas;
      console.log('Asignaturas obtenidas para el profesor:', this.asignaturas);
    } catch (error) {
      console.error("Error al obtener las asignaturas:", error);
    } finally {
      loading.dismiss();
    }
  }




  // Cargar las secciones correspondientes a una asignatura
async cargarSecciones(asignaturaId: string) {
  if (!this.seccionesPorAsignatura[asignaturaId]) {
    const secciones = await this.firebaseSvc.getAllSecciones();
    console.log('Secciones obtenidas:', secciones);  // Verifica qué secciones obtienes
    this.seccionesPorAsignatura[asignaturaId] = secciones.filter(seccion => seccion.asignatura === asignaturaId && seccion.profesor === this.user().uid);
    console.log('Secciones filtradas:',asignaturaId,'',this.user().uid, this.seccionesPorAsignatura[asignaturaId]);  // Verifica el filtro
  }
}

















  async ngOnInit() {
    const user = this.user();

    if (user && user.uid) {
      try {

        const userData = await this.firebaseSvc.getProfesorNombre(user.uid);
        this.nombreprofe = userData.name + ' ' + userData.lastname; // Suponiendo que 'nombre' es un campo en el documento del usuario


        // Obtenemos las asignaturas para el profesor
        await this.obtenerTodasLasAsignaturas(user.uid);

        // Para cada asignatura obtenemos las secciones
        for (const asignatura of this.asignaturas) {
          await this.cargarSecciones(asignatura.uid); // Asignatura ahora tiene el uid del profesor
        }
      } catch (error) {
        console.error("Error al obtener las asignaturas:", error);
      }
    } else {
      console.error("El UID del profesor no está disponible.");
      this.firebaseSvc.resetUserData(); // Resetea los datos si no hay usuario
    }
  }
























  // Obtener el usuario desde localStorage
  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  // Navegar al detalle de la sección
  abrirDetalleSeccion(seccionId: string) {
    console.log('ID de la sección:', seccionId);
    this.router.navigate(['/main-profesor/ramos-profesor', seccionId]); // Navega a la página de detalle de la sección con el UID
  }

}
