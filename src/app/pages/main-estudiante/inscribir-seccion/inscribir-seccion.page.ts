import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Asignatura } from 'src/app/models/asignatura.model'; // Modelo Asignatura
import { Seccion } from 'src/app/models/seccion.model'; // Modelo Sección
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-inscribir-seccion',
  templateUrl: './inscribir-seccion.page.html',
  styleUrls: ['./inscribir-seccion.page.scss'],
})
export class InscribirSeccionPage implements OnInit {

  // Formulario reactivo
  form = new FormGroup({
    asignatura: new FormControl('', [Validators.required]), // Asignatura seleccionada
    seccion: new FormControl('', [Validators.required]), // Sección seleccionada
    alumno: new FormControl(''), // Alumno (se asignará desde localStorage)
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  localStorageSvc = inject(LocalStorageService)

  // Lista de asignaturas para el campo select
  asignaturas: Asignatura[] = [];
  secciones: Seccion[] = [];  // Lista de secciones basadas en la asignatura seleccionada
  alumnoUid: string = ''; // Almacenaremos el UID del alumno aquí

  constructor(private menuCtrl: MenuController) { }

  ngOnInit() {
    this.menuCtrl.enable(true, 'menu-estudiante');

    // Cargar el listado de asignaturas disponibles
    this.loadAsignaturas();
    // Obtener el objeto completo del usuario desde localStorage
    const userData = localStorage.getItem('user');

    if (userData) {
      const user = JSON.parse(userData);
      this.alumnoUid = user.uid; // Guardar UID en la propiedad del componente
    }
    // Asignar el UID del alumno al formulario (aunque no lo muestres)
    this.form.controls.alumno.setValue(this.alumnoUid);
  }















  async loadAsignaturas() {
    try {
      const hasInternet = await this.utilsSvc.checkInternetConnection();
  
      if (hasInternet) {
        // Si hay conexión, cargar las asignaturas desde Firebase
        this.firebaseSvc.getAsignaturas().subscribe({
          next: (asignaturas) => {
            console.log('Asignaturas cargadas:', asignaturas);
            this.asignaturas = asignaturas; // Actualizar el estado de asignaturas
            
            // Guardar asignaturas en localStorage
            this.localStorageSvc.setIfNotExists('asig', this.asignaturas);
          },
          error: (error) => {
            console.error('Error al cargar las asignaturas:', error);
            this.utilsSvc.presentToast({
              message: 'No se pudo cargar las asignaturas',
              duration: 2000,
              color: 'danger',
              position: 'middle',
              icon: 'alert-circle-outline'
            });
          }
        });
      } else {
        // Si no hay conexión, cargar asignaturas desde localStorage
        const cachedAsignaturas = this.localStorageSvc.get('asig');
        if (cachedAsignaturas) {
          console.log('Asignaturas cargadas desde localStorage:', cachedAsignaturas);
          this.asignaturas = cachedAsignaturas;
        } else {
          console.warn('No se encontraron asignaturas en localStorage.');
          this.utilsSvc.presentToast({
            message: 'No hay conexión y no se encontraron datos locales',
            duration: 2000,
            color: 'warning',
            position: 'middle',
            icon: 'cloud-offline-outline'
          });
        }
      }
    } catch (error) {
      console.error('Error al cargar las asignaturas:', error);
      this.utilsSvc.presentToast({
        message: 'Ocurrió un error inesperado',
        duration: 2000,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    }
  }

















  // Función para cargar las secciones disponibles para una asignatura seleccionada
  onAsignaturaChange(event) {
    const asignaturaUid = event.detail.value;
    console.log('Asignatura seleccionada:', asignaturaUid); // Verifica que el UID esté llegando correctamente

    if (asignaturaUid) {
      this.loadSecciones(asignaturaUid); // Cargar secciones para la asignatura seleccionada
    } else {
      this.secciones = []; // Si no se ha seleccionado una asignatura, limpiar las secciones
    }
  }













  // Función para cargar las secciones basadas en la asignatura seleccionada
  async loadSecciones(asignaturaUid: string) {
    if (!asignaturaUid) {
      console.error('El UID de la asignatura no es válido:', asignaturaUid);
      return;
    }
  
    const hasInternet = await this.utilsSvc.checkInternetConnection();
  
    if (hasInternet) {
      // Modo Online: Obtener todas las secciones desde Firebase
      this.firebaseSvc.getTodasLasSecciones().subscribe({
        next: (todasSecciones) => {
          if (Array.isArray(todasSecciones) && todasSecciones.length > 0) {
            // Almacenar todas las secciones en localStorage
            this.localStorageSvc.set('todas_secciones', todasSecciones);
  
            // Filtrar solo las secciones de la asignatura actual
            this.secciones = todasSecciones.filter(sec => sec.asignatura === asignaturaUid);
            console.log(`Secciones disponibles para la asignatura ${asignaturaUid} (online):`, this.secciones);
          } else {
            console.warn('No se encontraron secciones disponibles');
            this.secciones = [];
          }
        },
        error: (error) => {
          console.error('Error al cargar todas las secciones (online):', error);
          this.utilsSvc.presentToast({
            message: 'No se pudieron cargar las secciones. Intente nuevamente.',
            duration: 2000,
            color: 'danger',
            position: 'middle',
            icon: 'alert-circle-outline'
          });
        }
      });
    } else {
      // Modo Offline: Cargar todas las secciones desde el almacenamiento local
      const todasSecciones = await this.localStorageSvc.get('todas_secciones');
      if (todasSecciones) {
        // Filtrar las secciones de la asignatura seleccionada
        this.secciones = todasSecciones.filter(sec => sec.asignatura === asignaturaUid);
        console.log(`Secciones cargadas desde cache para la asignatura ${asignaturaUid} (offline):`, this.secciones);
      } else {
        console.warn('No se encontraron secciones almacenadas en modo offline');
        this.utilsSvc.presentToast({
          message: 'No tienes conexión y no hay datos almacenados para esta asignatura.',
          duration: 2000,
          color: 'warning',
          position: 'middle',
          icon: 'cloud-offline-outline'
        });
        this.secciones = [];
      }
    }
  }













  





  // Función para manejar el envío del formulario de inscripción
  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      const inscripcionData = this.form.value; // { asignatura, seccion, alumno }
      const asignaturaUid = inscripcionData.asignatura;
      const alumnoUid = this.alumnoUid;

      try {
        console.log('Alumno UID:', alumnoUid);
        console.log('Asignatura UID:', asignaturaUid);
        // Verificar si el alumno ya está inscrito en otra sección de la misma asignatura
        const yaInscripto = await this.firebaseSvc.verificarInscripcionExistente(alumnoUid, asignaturaUid);

        if (!yaInscripto) {
          this.utilsSvc.presentToast({
            message: 'Ya estás inscrito en una sección de esta asignatura',
            duration: 2000,
            color: 'danger',
            position: 'middle',
            icon: 'alert-circle-outline'
          });
          return;
        }

        // Crear el objeto de inscripción
        const inscripcion = {
          asignatura: asignaturaUid,
          seccion: inscripcionData.seccion,
          alumno: alumnoUid,
        };

        // Verificar la conexión a Internet
        const isOnline = await this.utilsSvc.checkInternetConnection();
        if (isOnline) {
          // Si está online, proceder a inscribir en Firebase
          await this.firebaseSvc.inscribirEstudiante(alumnoUid, inscripcion.seccion, inscripcion.asignatura);
          this.utilsSvc.presentToast({
            message: 'Inscripción realizada con éxito',
            duration: 2000,
            color: 'success',
            position: 'middle',
            icon: 'checkmark-circle-outline'
          });
        } else {
          // Si está offline, guardar la inscripción localmente en localStorage
          const inscripcionesOffline = this.localStorageSvc.get('inscripcionesOffline') || [];
          inscripcionesOffline.push(inscripcion);
          this.localStorageSvc.set('inscripcionesOffline', inscripcionesOffline);

          this.utilsSvc.presentToast({
            message: 'Estás offline. Inscripción guardada para sincronización.',
            duration: 2000,
            color: 'warning',
            position: 'middle',
            icon: 'wifi-off'
          });
        }

        // Limpiar el formulario después de la inscripción
        this.form.reset();
        this.utilsSvc.routerLink('/main-estudiante/home-estudiante');

      } catch (error) {
        console.error('Error al inscribir:', error);
        this.utilsSvc.presentToast({
          message: 'Error al realizar la inscripción',
          duration: 2000,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
      } finally {
        loading.dismiss();
      }
    }
  }
}
