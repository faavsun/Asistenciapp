import { Component, inject, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils.service';
import { Asignatura } from 'src/app/models/asignatura.model'; // Modelo Asignatura
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-crear-asignatura',
  templateUrl: './crear-asignatura.page.html',
  styleUrls: ['./crear-asignatura.page.scss'],
})
export class CrearAsignaturaPage implements OnInit {

  form = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    maxEstudiantes: new FormControl('', [Validators.required, Validators.min(1)]),
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  localStorageSvc = inject(LocalStorageService);

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
          icon: 'alert-circle-outline',
        });
        loading.dismiss();
        return;
      }

      // Obtener el objeto del usuario desde localStorage
      const userData = localStorage.getItem('user');
      let uidProfesor = '';

      if (userData) {
        const user = JSON.parse(userData); // Convierte el string JSON en un objeto
        uidProfesor = user.uid; // Obtiene el UID del profesor
      }

      // Crear el objeto de asignatura sin el UID
      const asignatura: Asignatura = {
        uid_profesor: uidProfesor,  // El UID del profesor desde localStorage
        nombre: asignaturaData.nombre,
        maxEstudiantes: maxEstudiantes, // Valor numérico para maxEstudiantes
        uid: Date.now().toString(), // Aquí asignamos un UID temporal basado en el timestamp
      };

      // Verificar la conexión a Internet
      const isOnline = await this.utilsSvc.checkInternetConnection();

      if (isOnline) {
        try {
          // Llamar al servicio para crear la asignatura en Firebase
          const asignaturaCreada = await this.firebaseSvc.createAsignatura(asignatura);

          // Obtener el UID del documento recién creado y agregarlo al objeto
          asignatura.uid = asignaturaCreada.id;

          // Actualizar la asignatura con el UID real
          await this.firebaseSvc.updateAsignatura(asignatura);

          // Mostrar mensaje de éxito
          this.utilsSvc.presentToast({
            message: 'Asignatura creada con éxito',
            duration: 2000,
            color: 'success',
            position: 'middle',
            icon: 'checkmark-circle-outline',
          });

          // Redirigir a otra página
          this.utilsSvc.routerLink('/main-profesor/home-profesor');
        } catch (error) {
          console.log(error);
          this.utilsSvc.presentToast({
            message: 'Error al crear la asignatura',
            duration: 2000,
            color: 'danger',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        }
      } else {
        // Si no hay conexión, guardar la asignatura localmente con el UID temporal
        let asignaturasOffline = (await this.localStorageSvc.get('asignaturasOffline')) || [];
        asignaturasOffline.push(asignatura);

        // Guardamos las asignaturas offline en localStorage
        await this.localStorageSvc.set('asignaturasOffline', asignaturasOffline);

        this.utilsSvc.presentToast({
          message: 'Asignatura guardada localmente, se sincronizará cuando haya conexión',
          duration: 2000,
          color: 'warning',
          position: 'middle',
          icon: 'cloud-offline-outline',
        });
      }

      loading.dismiss();
    }
  }
}
