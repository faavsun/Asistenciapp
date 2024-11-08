import { Component, inject, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Seccion } from 'src/app/models/seccion.model';
import { Asignatura } from 'src/app/models/asignatura.model';

@Component({
  selector: 'app-ramos',
  templateUrl: './ramos.page.html',
  styleUrls: ['./ramos.page.scss'],
})
export class RamosPage implements OnInit {
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  seccionId: string | null = null;
  seccion: Seccion | null = null;
  asignatura: Asignatura | null = null;

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
   // this.menuCtrl.enable(true);
    this.seccionId = this.route.snapshot.paramMap.get('seccionId');
    console.log("ID de la sección:", this.seccionId);
    
    if (this.seccionId) {
      await this.loadSeccionData(this.seccionId);
    } else {
      console.error("Sección ID no proporcionado");
    }
  }

  private async loadSeccionData(seccionId: string) {
    const loading = await this.utilsSvc.loading();
    await loading.present();

    try {
      this.seccion = await this.firebaseSvc.getSeccionById(seccionId);
      if (!this.seccion) throw new Error(`Sección no encontrada para el ID: ${seccionId}`);

      console.log('Datos de la sección:', this.seccion);
      await this.loadAsignaturaAndProfesor(this.seccion.asignatura, this.seccion.profesor);
    } catch (error) {
      this.handleError(error);
    } finally {
      loading.dismiss(); // Asegúrate de que el loading se disipe en ambos casos
    }
  }

  private async loadAsignaturaAndProfesor(asignaturaId: string | undefined, profesorId: string | undefined) {
    if (asignaturaId) {
      this.asignatura = await this.firebaseSvc.getAsignaturaById(asignaturaId);
      console.log('Datos de la asignatura:', this.asignatura);
    } else {
      console.error('La sección no tiene una asignatura válida');
    }

    if (profesorId) {
      const profesor = await this.firebaseSvc.getUserById(profesorId);
      if (profesor) {
        this.seccion.profesor = `${profesor.name} ${profesor.lastname}`;
        console.log('Datos del profesor:', profesor);
      } else {
        console.error('Profesor no encontrado para el UID:', profesorId);
      }
    } else {
      console.error('La sección no tiene un UID de profesor válido');
    }
  }

  private handleError(error: any) {
    console.error('Error al cargar los datos de la sección:', error);
  }

  Marcar() {
    console.log("Marcar asistencia");
    this.router.navigate(['/main-estudiante/marcar', this.seccionId]);
  }
}
