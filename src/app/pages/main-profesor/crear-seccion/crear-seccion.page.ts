import { Component, inject, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils.service';
import { Seccion } from 'src/app/models/seccion.model'; // Modelo Sección
import { Asignatura } from 'src/app/models/asignatura.model'; // Modelo Asignatura

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

    const profesorUid = this.profesorUid; // Se obtiene desde localStorage o la variable de componente
    this.firebaseSvc.getAsignaturasPorProfesor(profesorUid).then(asignaturas => {
      this.asignaturas = asignaturas;
    }).catch(error => {
      console.log('Error al cargar las asignaturas:', error);
      this.utilsSvc.presentToast({
        message: 'No se pudo cargar las asignaturas',
        duration: 2000,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    }).finally(() => {
      loading.dismiss();
    });
  }

  // Función para manejar el envío del formulario
  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      // Obtener los valores del formulario
      const seccionData = this.form.value; // { nombre, asignatura, aula, profesor }

      // Crear el objeto de sección sin el UID (porque Firebase generará el UID automáticamente)
      const seccion: Seccion = {
        nombre: seccionData.nombre,
        asignatura: seccionData.asignatura, // Asignatura seleccionada
        aula: seccionData.aula,
        profesor: seccionData.profesor, // Aquí se usa el valor de profesor desde el formulario
      };

      try {
        // Llamar al servicio para crear la sección en Firebase
        const docRef = await this.firebaseSvc.createSeccion(seccion);

        seccion.uid = docRef.id;

        await this.firebaseSvc.updateSeccion(seccion);

        // Restablecer el formulario
        this.form.reset();
        // Aquí puedes usar el objeto seccionConUid que ya tiene el UID generado
        // Redirigir o hacer alguna otra acción si es necesario

        this.utilsSvc.presentToast({
          message: 'Sección creada con éxito',
          duration: 2000,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'
        });

        // Redirigir a otra página (por ejemplo, listado de secciones)
        this.utilsSvc.routerLink('/main-profesor/home-profesor');

        // Limpiar el formulario después de crear la sección
        this.form.reset();
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
