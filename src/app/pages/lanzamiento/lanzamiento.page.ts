import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonRouterOutlet, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-lanzamiento',
  templateUrl: './lanzamiento.page.html',
  styleUrls: ['./lanzamiento.page.scss'],
})
export class LanzamientoPage implements OnInit {

  constructor(private router: Router,private menuCtrl: MenuController,private routerOutlet: IonRouterOutlet) { }

  ngOnInit() {
    this.menuCtrl.enable(false); // Desactivar el menú en esta vista
    this.menuCtrl.swipeGesture(false);
    this.routerOutlet.swipeGesture = false; // Desactivar gestos en este componente
  }

  ionViewWillLeave() {
    this.routerOutlet.swipeGesture = true; // Reactivar gestos cuando se deje la vista
  }

  async Lanzamiento() {

    {
      this.router.navigate(['/login']);
    }
  }

  async Lanzamiento2() {

    {
      this.router.navigate(['/registro']);
    }
  }
}

