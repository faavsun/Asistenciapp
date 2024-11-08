import { Component, inject, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';


import { FirebaseService } from 'src/app/services/firebase.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })



  firebaseSvc = inject(FirebaseService)
  utilsSvc = inject(UtilsService)



  constructor(private menuCtrl: MenuController) { }

  ngOnInit() {
    this.menuCtrl.enable(false); // Desactivar el menú en esta vista
  }




  
  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();
  
      // Reinicia los datos del usuario en el servicio
      this.firebaseSvc.resetUserData();
  
      this.firebaseSvc.signIn(this.form.value as User).then(res => {
        this.getUserInfo(res.user.uid);
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



  async getUserInfo(uid: string) {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();
  
      let path = `users/${uid}`;
  
      this.firebaseSvc.getDocument(path).then((user: User) => {
        if (user) {
          this.utilsSvc.saveInLocalStorage('user', user);
  
          // Verificar el tipo de usuario y redirigir a la ruta correspondiente
          if (user.tipo === 'estudiante') {
            this.utilsSvc.routerLink('/main-estudiante/home');
          } else if (user.tipo === 'profesor') {
            this.utilsSvc.routerLink('/main-profesor/home-profesor');
          }
  
          this.form.reset();
          this.utilsSvc.presentToast({
            message: `Te damos la bienvenida ${user.name}`,
            duration: 1500,
            color: 'primary',
            position: 'middle',
            icon: 'person-circle-outline'
          });
        } else {
          console.error('No se encontraron datos del usuario.');
        }
      }).catch(error => {
        console.log(error);
      }).finally(() => {
        loading.dismiss();
      });
    }
  }
















  recuperar() {
    this.utilsSvc.routerLink('/olvidada');
  }

}
