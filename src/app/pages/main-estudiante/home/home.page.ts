import { Component, inject, OnInit } from '@angular/core';
import { IonRouterOutlet, MenuController } from '@ionic/angular';
import { AppComponent } from 'src/app/app.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
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
  alumnoUid: string = ''; // UID del estudiante
  dataCompleta: any = {}; // Estructura completa para almacenar datos relacionados
  dataCompletap: any = {}; // Estructura completa para almacenar datos relacionados
  asignaturas: any[] = []; // Lista de asignaturas para mostrar en la plantilla
  asignaturasPendientes: any[] = []; // Lista de asignaturas para mostrar en la plantilla
  union: any[];

  constructor(
    private router: Router,
    private appComponent: AppComponent,
    private menuCtrl: MenuController,
    private routerOutlet: IonRouterOutlet
  ) { }

  ngOnInit() {
    this.routerOutlet.swipeGesture = false; // Desactivar gestos en este componente
    this.menuCtrl.enable(true, 'menu-estudiante');
    this.loadData();
    this.resetMenu();

    // Obtener el objeto completo del usuario desde localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.alumnoUid = user.uid; // Guardar UID en la propiedad del componente
    }
  }

  resetMenu() {
    this.menuCtrl.enable(false, 'menu-estudiante'); // Desactiva el menú
    setTimeout(() => {
      this.menuCtrl.enable(true, 'menu-estudiante'); // Actívalo nuevamente
    }, 100); // Espera un breve momento
  }

  async loadData() {
    const loading = await this.utilsSvc.loading();
    await loading.present();

    try {
      const hasInternet = await this.utilsSvc.checkInternetConnection();
      if (hasInternet) {
        console.log('Conexión a internet detectada. Cargando desde Firebase...');




        const [secciones, asignaturas, users] = await Promise.all([
          this.firebaseSvc.getAllSeccion(),
          this.firebaseSvc.getAllAsignaturas(),
          this.firebaseSvc.getAllUsers(),
        ]);

        console.log('Todas Secciones:', secciones);
        console.log('Todas Asignaturas:', asignaturas);
        console.log('Todas Usuarios:', users);

        // Guardar los datos localmente
        await this.localStorageSvc.set('secciones', secciones);
        await this.localStorageSvc.set('asignaturas', asignaturas);
        await this.localStorageSvc.set('users', users);




        const uidEstudiante = this.alumnoUid; // UID del estudiante

        if (uidEstudiante) {
          const alumnoSecciones = await this.firebaseSvc.getAlumnoSeccion(uidEstudiante);
          console.log('AlumnoSeccion:', alumnoSecciones);

          const secciones = await Promise.all(
            alumnoSecciones.map(async (alumnoSeccion: any) => {
              const seccion = await this.firebaseSvc.getSeccion(alumnoSeccion.seccion);
              return { ...seccion, asignatura: alumnoSeccion.asignatura };
            })
          );
          console.log('Secciones:', secciones);

          const asignaturaas = await Promise.all(
            secciones.map(async (seccion: any) => {
              const asignaturaa = await this.firebaseSvc.getAsignatura(seccion.asignatura);
              return asignaturaa; // Añade el ID de la sección
            })
          );
          console.log('Asignaturaas:', asignaturaas);

          const profesores = await Promise.all(
            secciones.map(async (seccion: any) => {
              const profesor = await this.firebaseSvc.getProfesor(seccion.profesor);
              return profesor; // Añade el ID de la sección
            })
          );
          console.log('Profesores:', profesores);

          this.asignaturas = await Promise.all(
            secciones.map(async (seccion: any) => {
              const asignatura = await this.firebaseSvc.getAsignatura(seccion.asignatura);
              return { asignatura, seccionId: seccion.uid }; // Añade el ID de la sección
            })
          );
          console.log('Asignaturas:', this.asignaturas);

          this.dataCompleta = {
            alumno: { uid: uidEstudiante },
            alumnoSeccion: alumnoSecciones,
            secciones,
            asignaturas: this.asignaturas,
            asignaturaas,
            profesores,
          };

          this.localStorageSvc.set('dataCompleta', this.dataCompleta);
        } else {
          console.warn('No se encontró el UID del estudiante en localStorage.');
        }
      } else {
        console.warn('Sin conexión a internet. Cargando desde localStorage...');
        const dataGuardada = this.localStorageSvc.get('dataCompleta');
        if (dataGuardada) {
          this.dataCompleta = dataGuardada;
          this.asignaturas = this.dataCompleta.asignaturas || [];
          console.log('Datos cargados desde localStorage:', this.dataCompleta);
          console.log('Datos cargados asignaturas desde localStorage:', this.asignaturas);
        } else {
          console.warn('No hay datos guardados en localStorage.');
        }







        // Cargar datos de asignaturas pendientes desde 'inscripcionesOffline' en localStorage
        const dataGuardadap = this.localStorageSvc.get('inscripcionesOffline');
        if (dataGuardadap) {
          // Procesar datos con obtenerDatosAsignaturaSeccion
          this.dataCompletap = await this.obtenerDatosAsignaturaSeccion(dataGuardadap);
          await this.localStorageSvc.set('datosoffline',this.dataCompletap);
          this.union = this.dataCompletap.secciones.map((
                        seccion,index)=>{
                        const asignatura = 
                      this.dataCompletap.asignaturas[index
                      ] || {}; 
                      const profesor = this.dataCompletap.alumnos[index] || {};
                      
                      return {seccionuid: seccion.uid,
                        seccionnombre: seccion.nombre,
                        ...seccion, ...asignatura, ...profesor};});
          
          
          this.asignaturasPendientes = this.union || [];
          console.log('Datos pendientes:', this.dataCompletap);
          console.log('Datos de asignaturas pendientes:', this.asignaturasPendientes);
          console.log('Union:', this.union);
        } else {
          console.warn('No se encontró inscripcionesOffline en localStorage.');
        }







      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      loading.dismiss();
    }
  }







  async obtenerDatosAsignaturaSeccion(inscripciones: any[]) {
    try {
      // Cargar datos desde localStorage
      const seccionesGuardadas = await this.localStorageSvc.get('secciones') || [];
      const asignaturasGuardadas = await this.localStorageSvc.get('asignaturas') || [];
      const usuariosGuardados = await this.localStorageSvc.get('users') || [];

      // Consultar datos detallados desde los IDs en `inscripciones`
      const datosCompletos = inscripciones.map((inscripcion: any) => {
        const seccion = seccionesGuardadas.find((s: any) => s.uid === inscripcion.seccion);
        const asignatura = asignaturasGuardadas.find((a: any) => a.uid === inscripcion.asignatura);
        const alumno = usuariosGuardados.find((u: any) => u.uid === seccion.profesor);

        if (seccion && asignatura && alumno) {
          return { seccion, asignatura, alumno };
        }
        return null;
      }).filter((d) => d !== null); // Filtrar datos incompletos

      return {
        asignaturas: datosCompletos.map(d => d.asignatura),
        secciones: datosCompletos.map(d => d.seccion),
        alumnos: datosCompletos.map(d => d.alumno)
      };
    } catch (error) {
      console.error('Error al obtener datos completos de asignatura y sección:', error);
      return { asignaturas: [], secciones: [], alumnos: [] };
    }
  }











  abrirDetalleSeccion(seccionId: string) {
    console.log('ID de la sección:', seccionId);
    this.router.navigate(['/main-estudiante/ramos', seccionId]);
  }
}
