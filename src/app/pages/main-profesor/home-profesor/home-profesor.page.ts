import { Component, inject, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AppComponent } from 'src/app/app.component';
import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Asignatura } from 'src/app/models/asignatura.model';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';



@Component({
  selector: 'app-home-profesor',
  templateUrl: './home-profesor.page.html',
  styleUrls: ['./home-profesor.page.scss'],
})
export class HomeProfesorPage implements OnInit {

  firebaseSvc = inject(FirebaseService)
  utilsSvc = inject(UtilsService)

  asignaturas: Asignatura[] = [];

  seccionesPorAsignatura: { [key: string]: { id: string; nombre: string; profesor: string }[] } = {};

  constructor(private router: Router,private appComponent: AppComponent,private menuCtrl: MenuController ) { }

 
  async obtenerTodasLasAsignaturas(profesorUid: string) {
    const loading = await this.utilsSvc.loading();
    await loading.present();
  
    try {
      const secciones = await this.firebaseSvc.getAllSecciones();
      const seccionesDelProfesor = secciones.filter(seccion => seccion.profesor === profesorUid);
  
      const asignaturaIds = [...new Set(seccionesDelProfesor.map(seccion => seccion.asignatura))];
  
      const asignaturasPromises = asignaturaIds.map(async (asignaturaId) => {
        const asignatura = await this.firebaseSvc.getAsignaturaPorId(asignaturaId);
        const profesor = await this.firebaseSvc.getProfesorNombre(profesorUid); // Obtener el nombre del profesor
        return asignatura ? { uid: asignatura.uid, nombre: asignatura.nombre, profesorNombre: profesor.name || 'Desconocido' } : null;
      });
  
      const asignaturasConNombres = (await Promise.all(asignaturasPromises)).filter(asignatura => asignatura !== null);
  
      this.asignaturas = asignaturasConNombres;
      console.log('Asignaturas obtenidas para el profesor:', this.asignaturas);
    } catch (error) {
      console.error("Error al obtener las asignaturas:", error);
    } finally {
      loading.dismiss();
    }
  }



  async cargarSecciones(asignaturaId: string) {
    if (!this.seccionesPorAsignatura[asignaturaId]) {
      const secciones = await this.firebaseSvc.getAllSecciones();
      this.seccionesPorAsignatura[asignaturaId] = await Promise.all(
        secciones
          .filter(seccion => seccion.asignatura === asignaturaId && seccion.profesor === this.user().uid)
          .map(async seccion => {
            const profesor = await this.firebaseSvc.getProfesorNombre(seccion.profesor); // Obtener el nombre del profesor
            return {
              id: seccion.id,
              nombre: seccion.nombre,
              profesor: profesor.name +' '+ profesor.lastname || 'Desconocido' // Almacenar el nombre del profesor
            };
          })
      );
    }
  }





  async ngOnInit() {
   // this.menuCtrl.enable(true);
    const user = this.user();
    
    if (user && user.uid) {
      try {
        await this.obtenerTodasLasAsignaturas(user.uid);
        for (const asignatura of this.asignaturas) {
          await this.cargarSecciones(asignatura.uid);
        }
      } catch (error) {
        console.error("Error al obtener las asignaturas:", error);
      }
    } else {
      console.error("El UID del profesor no está disponible.");
      this.firebaseSvc.resetUserData(); // Resetea los datos si no hay usuario
    }
  }



  user(): User{ 
    return this.utilsSvc.getFromLocalStorage('user');
  }
  
  abrirDetalleSeccion(seccionId: string) {
    console.log('ID de la sección:', seccionId); // Verificar el ID antes de navegar
    this.router.navigate(['/main-profesor/ramos-profesor', seccionId]); // Navega a la página de detalle de la sección con el UID
  }

}
