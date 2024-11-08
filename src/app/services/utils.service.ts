import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  router = inject(Router);
  
  constructor(private toastController: ToastController) {}

  async showToast(message: string, duration: number = 2000): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: 'bottom',
      color: 'primary' // Puedes ajustar el color
    });
    toast.present();
  }


  async takePicture() {
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });
  };





//===========loading==============
loading(){
  return this.loadingCtrl.create({spinner: 'dots'  })
}


//========= Toast ================
async presentToast(opts?: ToastOptions){
  const toast = await this.toastCtrl.create(opts);
  toast.present();
}


//====== Enrutar a cualquier pagina========
routerLink(url: string){
  return this.router.navigateByUrl(url);
}

//======= guardar un elemento en el localstorage=======
saveInLocalStorage(key: string, value:any){
  return localStorage.setItem(key, JSON.stringify(value));
}



//======= Obtiene un elemento en el localstorage=======
getFromLocalStorage(key: string){
  return JSON.parse(localStorage.getItem(key));
}





}
