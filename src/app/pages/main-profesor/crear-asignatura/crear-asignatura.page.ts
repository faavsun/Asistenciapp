import { Component, inject, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils.service';
import { Asignatura } from 'src/app/models/asignatura.model'; // Modelo Asignatura

@Component({
  selector: 'app-crear-asignatura',
  templateUrl: './crear-asignatura.page.html',
  styleUrls: ['./crear-asignatura.page.scss'],
})
export class CrearAsignaturaPage implements OnInit {

  form = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    maxEstudiantes: new FormControl('', [Validators.required, Validators.min(1)])
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  constructor(private menuCtrl: MenuController) { }

  ngOnInit() {
    this.menuCtrl.enable(true, 'menu-profesor');
  }

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      // Obtener los valores del formulario
      const asignaturaData = this.form.value; // { nombre, maxEstudiantes }

      // Convertir maxEstudiantes de string a número
      const maxEstudiantes = parseInt(asignaturaData.maxEstudiantes, 10);

      // Verificar si la conversión fue exitosa
      if (isNaN(maxEstudiantes)) {
        this.utilsSvc.presentToast({
          message: 'La cantidad máxima de estudiantes debe ser un número válido',
          duration: 2000,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
        loading.dismiss();
        return;
      }

      // Crear el objeto de asignatura sin el UID
      const asignatura: Asignatura = {
        uid_profesor: localStorage.getItem('userUid'),  // El UID del profesor desde localStorage
        nombre: asignaturaData.nombre,
        maxEstudiantes: maxEstudiantes // Valor numérico para maxEstudiantes
      };

      try {
        // Llamar al servicio para crear la asignatura en Firebase
        const asignaturaCreada = await this.firebaseSvc.createAsignatura(asignatura);

        // Obtener el UID del documento recién creado y agregarlo al objeto
        asignatura.uid = asignaturaCreada.id; // 'id' es el UID del documento de Firestore

        // Actualizar la asignatura con el UID
        await this.firebaseSvc.updateAsignatura(asignatura);

        // Restablecer el formulario
        this.form.reset();

        // Mostrar mensaje de éxito
        this.utilsSvc.presentToast({
          message: 'Asignatura creada con éxito',
          duration: 2000,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'
        });

        // Redirigir a otra página (por ejemplo, listado de asignaturas)
        this.utilsSvc.routerLink('/main-profesor/home-profesor');
      } catch (error) {
        console.log(error);
        this.utilsSvc.presentToast({
          message: 'Error al crear la asignatura',
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
