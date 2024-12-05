import { Component, inject, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils.service';
import { Seccion } from 'src/app/models/seccion.model'; // Modelo Sección
import { Asignatura } from 'src/app/models/asignatura.model'; // Modelo Asignatura
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-crear-seccion',
  templateUrl: './crear-seccion.page.html',
  styleUrls: ['./crear-seccion.page.scss'],
})
export class CrearSeccionPage implements OnInit {

  // Formulario reactivo
  form = new FormGroup({
    nombre: new FormControl('', [Validators.required]), // Nombre de la sección
    asignatura: new FormControl('', [Validators.required]), // Asignatura seleccionada
    aula: new FormControl('', [Validators.required]), // Aula
    profesor: new FormControl(''), // Profesor (se asignará desde localStorage)
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  localStorageSvc = inject(LocalStorageService);

  // Lista de asignaturas para el campo select
  asignaturas: Asignatura[] = [];
  profesorUid: string = ''; // Almacenaremos el UID del profesor aquí

  constructor(private menuCtrl: MenuController) { }

  ngOnInit() {
    this.menuCtrl.enable(true, 'menu-profesor');

    // Cargar el listado de asignaturas desde Firebase
    this.loadAsignaturas();

    // Obtener el objeto completo del usuario desde localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.profesorUid = user.uid; // Guardar UID en la propiedad del componente
    }

    // Asignar el UID del profesor al formulario
    this.form.controls.profesor.setValue(this.profesorUid);

  }

  // Función para cargar las asignaturas disponibles
  async loadAsignaturas() {
    const loading = await this.utilsSvc.loading();
    await loading.present();
  
    try {
      const isOnline = await this.utilsSvc.checkInternetConnection();
  
      if (isOnline) {
        // Si hay conexión, cargamos las asignaturas desde Firebase
        const profesorUid = this.profesorUid;
        const asignaturasOnline = await this.firebaseSvc.getAsignaturasPorProfesor(profesorUid);
        // Guardamos las asignaturas online en el localStorage bajo la clave "asignaturasOnline"
        this.asignaturas = asignaturasOnline;
      } else {
        // Si no hay conexión, cargamos las asignaturas desde el localStorage (online + offline)
        const asignaturasOnline = await this.localStorageSvc.get('asignaturasProfesor') || [];  // Las que ya están guardadas online en localStorage
        //const asignaturasOffline = await this.localStorageSvc.get('asignaturasOffline') || []; // Las asignaturas offline
        //this.asignaturas = [...asignaturasOnline, ...asignaturasOffline];  // Combinamos ambas listas
        this.asignaturas = asignaturasOnline;
      }
    } catch (error) {
      console.log('Error al cargar las asignaturas:', error);
      this.utilsSvc.presentToast({
        message: 'No se pudo cargar las asignaturas',
        duration: 2000,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    } finally {
      loading.dismiss();
    }
  }

  // Función para manejar el envío del formulario
  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();
  
      const seccionData = this.form.value;
      const seccion: Seccion = {
        nombre: seccionData.nombre,
        asignatura: seccionData.asignatura,
        aula: seccionData.aula,
        profesor: this.profesorUid,
      };
  
      try {
        const isOnline = await this.utilsSvc.checkInternetConnection();
  
        if (isOnline) {
          // Si hay conexión, guardamos la sección en Firebase
          const docRef = await this.firebaseSvc.createSeccion(seccion);
          seccion.uid = docRef.id;
          await this.firebaseSvc.updateSeccion(seccion);
  
          this.utilsSvc.presentToast({
            message: 'Sección creada con éxito',
            duration: 2000,
            color: 'success',
            position: 'middle',
            icon: 'checkmark-circle-outline'
          });
        } else {
          // Si no hay conexión, guardamos la sección en localStorage
          let seccionesOffline = await this.localStorageSvc.get('seccionesOffline') || [];
          seccionesOffline.push(seccion); // Guardamos la sección offline
          await this.localStorageSvc.set('seccionesOffline', seccionesOffline); // Guardamos en localStorage
  
          this.utilsSvc.presentToast({
            message: 'Sección guardada offline. Se sincronizará cuando tengas conexión.',
            duration: 2000,
            color: 'warning',
            position: 'middle',
            icon: 'cloud-offline-outline'
          });
        }
  
        this.form.reset();
        this.utilsSvc.routerLink('/main-profesor/home-profesor');
      } catch (error) {
        console.error('Error al crear la sección:', error);
        this.utilsSvc.presentToast({
          message: 'Error al crear la sección',
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
