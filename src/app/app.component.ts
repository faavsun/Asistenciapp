import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  selectedMenuId: string = 'first'; // Valor por defecto, puede cambiarse según la vista
  constructor(private menu: MenuController) {
    
  }


  CloseMenu() {
    this.menu.close(); // Cerrar el menú cuando sale de la vista
  }
}
