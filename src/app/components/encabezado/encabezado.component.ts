import { Component, Input, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { MenuItem } from 'src/app/interfaces/menu-item';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-encabezado',
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.scss'],
})
export class EncabezadoComponent  implements OnInit {
  

  @Input() titulo="";
  defaultHref: string = '/lanzamiento'; // Valor predeterminado
  constructor(private menuCtrl: MenuController,private localStorageSvc: LocalStorageService) { }
  
  ngOnInit() {
    const user = this.localStorageSvc.get('user');
    if (user && user.tipo) {
      this.defaultHref = user.tipo === 'estudiante' 
        ? '/main-estudiante/home' 
        : '/main-profesor/home-profesor';
    }
  }

  
}
