import { Component, inject, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FormControl, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';  // Importar ValidatorFn aquí
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';

// Validador para correos de "profesor"
function emailProfesorValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const emailPattern = /@profesor\.duoc\.cl$/;
    if (emailPattern.test(control.value)) {
      return null;
    }
    return { 'emailProfesor': true };
  };
}

// Validador para correos de "estudiante"
function emailEstudianteValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const emailPattern = /@duocuc\.cl$/;
    if (emailPattern.test(control.value)) {
      return null;
    }
    return { 'emailEstudiante': true };
  };
}

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]), // Inicia con validación básica
    password: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    lastname: new FormControl('', [Validators.required, Validators.minLength(4)]),
    tipo: new FormControl('estudiante'),  // 'tipo' es "estudiante" por defecto
    aceptaTerminos: new FormControl(false, [Validators.requiredTrue])  // Requerido en true
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  constructor(private menuCtrl: MenuController, private navCtrl: NavController) {}

  ngOnInit() {
    this.menuCtrl.enable(false); // Desactivar el menú en esta vista

    // Monitorizar el campo tipo para aplicar la validación del correo cuando sea "profesor" o "estudiante"
    this.form.controls.tipo.valueChanges.subscribe(value => {
      this.applyEmailValidation(value);
    });
  }

  // Método para aplicar la validación personalizada al campo email
  applyEmailValidation(tipo: string) {
    const emailControl = this.form.controls.email;

    if (tipo === 'profesor') {
      // Si el tipo es "profesor", se añade la validación para correos de "profesor"
      emailControl.setValidators([Validators.required, Validators.email, emailProfesorValidator()]);
    } else if (tipo === 'estudiante') {
      // Si el tipo es "estudiante", se añade la validación para correos de "estudiante"
      emailControl.setValidators([Validators.required, Validators.email, emailEstudianteValidator()]);
    }

    // Recalcular el estado de las validaciones del campo email
    emailControl.updateValueAndValidity();
  }

  // Método para enviar el formulario
  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      const tipoUsuario = this.form.controls.tipo.value; // Aquí toma el valor del tipo de usuario

      // Aquí se hace el signup en Firebase
      this.firebaseSvc.signUp(this.form.value as User).then(async res => {
        await this.firebaseSvc.updateUser(this.form.value.name);

        let uid = res.user.uid;
        this.form.controls.uid.setValue(uid);  // Establecer el UID en el formulario
        this.setUserInfo(uid, tipoUsuario);  // Pasar el tipo de usuario a la función que guarda los datos

      }).catch(error => {
        console.log(error);

        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2000,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        });

      }).finally(() => {
        loading.dismiss();
      });
    }
  }

  // Guardar la información del usuario en la base de datos de Firebase
  async setUserInfo(uid: string, tipoUsuario: string) {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      let path = `users/${uid}`;
      delete this.form.value.password;  // No guardamos la contraseña en la base de datos

      // Incluir el tipo de usuario en el objeto que se guarda en Firebase
      this.firebaseSvc.setDocument(path, { ...this.form.value, tipo: tipoUsuario }).then(async res => {
        this.utilsSvc.saveInLocalStorage('user', this.form.value);
        this.utilsSvc.routerLink('/login');  // Navegamos a la pantalla de login

      }).catch(error => {
        console.log(error);

        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2000,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        });

      }).finally(() => {
        loading.dismiss();
      });
    }
  }

  // Método para volver a la página anterior
  goBack() {
    this.navCtrl.back();
  }
}
