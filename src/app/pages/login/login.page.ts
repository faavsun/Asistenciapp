import { Component, inject, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SHA256 } from 'crypto-js'; // Importa SHA256 para el manejo de hashes

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  localStorageSvc = inject(LocalStorageService);

  constructor(private menuCtrl: MenuController) {}

  ngOnInit() {
    // Verificar si el usuario ya está autenticado mediante localStorage
    const isLoggedIn = this.localStorageSvc.get('isLoggedIn');
    const user = this.localStorageSvc.get('user');
    console.log('Estado del usuario en ngOnInit:', { isLoggedIn, user });

    if (isLoggedIn === 'true' && user) {
      this.redirectUser(user);
    }
  }

  
  // Método de inicio de sesión
  async submit() {
    if (this.form.valid) {
      console.log('Formulario enviado:', this.form.value);
      const loading = await this.utilsSvc.loading();
      await loading.present();

      try {
        const isOnline = await this.utilsSvc.checkInternetConnection();
        console.log('Estado de la conexión a internet:', isOnline);

        if (isOnline) {
          this.firebaseSvc.resetUserData();
          const res = await this.firebaseSvc.signIn(this.form.value as User);

          // Generar hash de la contraseña ingresada
          const passwordHash = SHA256(this.form.value.password).toString();
          console.log('Hash de la contraseña generado:', passwordHash);

          await this.getUserInfo(res.user.uid, passwordHash);
        } else {
          const storedUser = this.localStorageSvc.get('user');
          const storedHash = this.localStorageSvc.get('passwordHash');
          const inputPasswordHash = SHA256(this.form.value.password).toString();

          if (storedUser && storedHash && storedUser.email === this.form.value.email) {
            if (storedHash === inputPasswordHash) {
              console.log('Usuario autenticado en modo offline.');
              this.getUserInfoOffline(storedUser);
            } else {
              console.warn('Contraseña incorrecta en modo offline.');
              this.utilsSvc.presentToast({
                message: 'Credenciales incorrectas.',
                duration: 2000,
                color: 'danger',
                position: 'middle',
              });
            }
          } else {
            console.warn('No se encontraron datos locales o el correo no coincide.');
            this.utilsSvc.presentToast({
              message: 'Necesitas estar conectado a Internet la primera vez.',
              duration: 2000,
              color: 'primary',
              position: 'middle',
            });
          }
        }
      } catch (error) {
        console.error('Error durante el inicio de sesión:', error);
        this.utilsSvc.presentToast({
          message: error.message || 'Error inesperado',
          duration: 2000,
          color: 'primary',
          position: 'middle',
        });
      } finally {
        loading.dismiss();
      }
    }
  }

  // Obtener información del usuario desde Firebase y almacenar hash de contraseña
  async getUserInfo(uid: string, passwordHash: string) {
    console.log('Obteniendo datos de usuario desde Firebase con UID:', uid);
    const loading = await this.utilsSvc.loading();
    await loading.present();

    const path = `users/${uid}`;
    this.firebaseSvc
      .getDocument(path)
      .then((user: User) => {
        if (user) {
          console.log('Usuario obtenido de Firebase:', user);

          // Almacenar datos y hash de la contraseña
          this.localStorageSvc.set('user', user);
          this.localStorageSvc.set('passwordHash', passwordHash); // Almacenar el hash de la contraseña
          this.localStorageSvc.set('isLoggedIn', 'true');
          this.localStorageSvc.set('sessionActive', 'true'); // Asegurar que sessionActive sea true

          this.redirectUser(user);
        } else {
          console.error('No se encontraron datos del usuario en Firebase.');
        }
      })
      .catch(error => {
        console.error('Error al obtener usuario desde Firebase:', error);
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  // Usar datos locales para redirigir al usuario sin conexión
  getUserInfoOffline(user: User) {
    console.log('Usando datos locales para redirigir:', user);
    this.localStorageSvc.set('isLoggedIn', 'true');
    this.localStorageSvc.set('sessionActive', 'true'); // Asegurar que sessionActive sea true
    this.redirectUser(user);
  }

  // Redirigir al usuario según su tipo
  redirectUser(user: User) {
    console.log('Tipo de usuario:', user.tipo);
    if (user.tipo === 'estudiante') {
      console.log('Redirigiendo al home de estudiante.');
      this.utilsSvc.routerLink('/main-estudiante/home');
    } else if (user.tipo === 'profesor') {
      console.log('Redirigiendo al home de profesor.');
      this.utilsSvc.routerLink('/main-profesor/home-profesor');
    } else {
      console.warn('Tipo de usuario desconocido:', user.tipo);
    }
  }

  // Recuperar contraseña
  recuperar() {
    console.log('Redirigiendo a recuperación de contraseña.');
    this.utilsSvc.routerLink('/olvidada');
  }
}
