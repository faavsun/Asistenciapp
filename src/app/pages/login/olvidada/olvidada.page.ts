import { Component, inject, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

import { FirebaseService } from 'src/app/services/firebase.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-olvidada',
  templateUrl: './olvidada.page.html',
  styleUrls: ['./olvidada.page.scss'],
})
export class OlvidadaPage implements OnInit {
  
    form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
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

      this.firebaseSvc.sendRecoveryEmail(this.form.value.email).then(res =>{
       
      this.utilsSvc.presentToast({
        message: 'Correo enviado con éxito',
        duration: 2000,
        color: 'primary',
        position: 'middle',
        icon: 'mail-outline'
      });

      this.utilsSvc.routerLink('/login');
      this.form.reset();

      }).catch(error =>{
        console.log(error);

        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2000,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })

      }).finally(() =>{
        loading.dismiss();
      })
    }

  }

}