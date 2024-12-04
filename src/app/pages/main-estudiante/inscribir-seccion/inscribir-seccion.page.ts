import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Asignatura } from 'src/app/models/asignatura.model'; // Modelo Asignatura
import { Seccion } from 'src/app/models/seccion.model'; // Modelo Sección

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

  // Lista de asignaturas para el campo select
  asignaturas: Asignatura[] = [];
  secciones: Seccion[] = [];  // Lista de secciones basadas en la asignatura seleccionada
  alumnoUid: string = ''; // Almacenaremos el UID del alumno aquí

  constructor(private menuCtrl: MenuController) {}

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

  // Función para cargar las asignaturas disponibles
  loadAsignaturas() {
    this.firebaseSvc.getAsignaturas().subscribe({
      next: (asignaturas) => {
        console.log('Asignaturas cargadas:', asignaturas);
        this.asignaturas = asignaturas; // Actualizar el estado de asignaturas
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
  loadSecciones(asignaturaUid: string) {
    this.firebaseSvc.getSeccionesPorAsignatura(asignaturaUid).subscribe({
      next: (secciones) => {
        console.log('Secciones cargadas:', secciones);  // Verifica que las secciones se reciban correctamente
        this.secciones = secciones;
      },
      error: (error) => {
        console.error('Error al cargar las secciones:', error);
        this.utilsSvc.presentToast({
          message: 'No se pudieron cargar las secciones',
          duration: 2000,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
      }
    });
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
        // Verificar si el alumno ya está inscrito en otra sección de la misma asignatura
        const yaInscripto = await this.firebaseSvc.verificarInscripcionExistente(alumnoUid, asignaturaUid);
        
        if (!yaInscripto) {
          // Si ya está inscrito en la misma asignatura, mostramos un mensaje y detenemos el proceso
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
          asignatura: asignaturaUid,  // Asignatura seleccionada
          seccion: inscripcionData.seccion,        // Sección seleccionada
          alumno: alumnoUid,          // Alumno que se inscribe
        };
  
        // Realizar la inscripción
        await this.firebaseSvc.inscribirEstudiante(alumnoUid, inscripcion.seccion,inscripcion.asignatura);
        
        console.log('Inscripción realizada con éxito');
        
        this.utilsSvc.presentToast({
          message: 'Inscripción realizada con éxito',
          duration: 2000,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'
        });
  
        // Redirigir a otra página
        this.utilsSvc.routerLink('/main-estudiante/home-estudiante');
  
        // Limpiar el formulario después de la inscripción
        this.form.reset();
  
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
