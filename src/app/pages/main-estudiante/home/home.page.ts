import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from '../../../interfaces/menu-item';
import { MenuController } from '@ionic/angular';
import { AppComponent } from 'src/app/app.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Asignatura } from 'src/app/models/asignatura.model';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  asignaturas: { asignatura: Asignatura, seccionId: string }[] = []; // Array modificado

  constructor(private router: Router, private appComponent: AppComponent, private menuCtrl: MenuController) { }

  ngOnInit() {
    //this.menuCtrl.enable(true); // Desactivar el menú en esta vista
    this.loadAsignaturas();
  }

  async loadAsignaturas() {
    const loading = await this.utilsSvc.loading();
    await loading.present();
    const uidEstudiante = localStorage.getItem('userUid'); // Asegúrate de que 'userUid' esté disponible
    console.log('UID Estudiante:', uidEstudiante); // Verifica que obtienes el UID correctamente
    if (uidEstudiante) {
      this.asignaturas = await this.firebaseSvc.getAsignaturasDeEstudiante(uidEstudiante);
      console.log('Asignaturas Cargadas:', this.asignaturas); // Verifica que se cargan las asignaturas junto con los IDs de las secciones
    } else {
      console.warn('No se encontró el UID del estudiante en localStorage.');
    }
    loading.dismiss();
  }

  abrirDetalleSeccion(seccionId: string) {
    console.log('ID de la sección:', seccionId); // Verificar el ID antes de navegar
    this.router.navigate(['/main-estudiante/ramos', seccionId]); // Navega a la página de detalle de la sección con el UID
  }

  signOut() {
    this.firebaseSvc.signOut();
  }
}