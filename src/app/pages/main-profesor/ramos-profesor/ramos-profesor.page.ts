import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Seccion } from 'src/app/models/seccion.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-ramos-profesor',
  templateUrl: './ramos-profesor.page.html',
  styleUrls: ['./ramos-profesor.page.scss'],
})
export class RamosProfesorPage implements OnInit {

  firebaseSvc = inject(FirebaseService)
  utilsSvc = inject(UtilsService)
  
  seccionId: string;
  seccion: Seccion | null = null; // Usar el modelo Seccion

  nombreAsignatura: string = '';
  profesorNombre: string = '';
  aula: string = 'xxx-x'; // Reemplaza con la lógica para obtener el aula si es necesario

  constructor(private router: Router,private route: ActivatedRoute,private menuCtrl: MenuController) { }

  ngOnInit() {
  //  this.menuCtrl.enable(true); // Desactivar el menú en esta vista
        // Obtener el ID de la sección desde la ruta
        this.seccionId = this.route.snapshot.paramMap.get('seccionId') || '';
        console.log('ID de sección a buscar:', this.seccionId);
        if (this.seccionId) {
          this.obtenerDatosSeccion(this.seccionId);
        } else {
          console.error('Sección ID no proporcionado');
        }
  }

  user(): User{ 
    return this.utilsSvc.getFromLocalStorage('user');
  }

  async obtenerDatosSeccion(id: string) {
    const loading = await this.utilsSvc.loading();
    await loading.present();
    try {
      this.seccion = await this.firebaseSvc.getSeccionPorId(id);
      console.log('Datos de la sección:', this.seccion);
      if (this.seccion) {
        const asignatura = await this.firebaseSvc.getAsignaturaPorId(this.seccion.asignatura);
        if (asignatura) {
          this.nombreAsignatura = asignatura.nombre; // Asignar el nombre de la asignatura
        }
        this.profesorNombre = this.user().name + ' ' + this.user().lastname; // Usar el nombre y apellido del profesor
        this.aula = this.seccion.aula; // Asignar el aula si está en el modelo Seccion
      }
    } catch (error) {
      console.error('Error obteniendo la sección:', error);
    }
    loading.dismiss();
  }

  Generar() {
    this.router.navigate(['/main-profesor/generar-profesor', this.seccionId]); // Navega a la página para generar el código QR
  }
  
  
  Lista() {
    this.router.navigate(['/main-profesor/lista-alumno', this.seccionId]); // Navega a la página para Visualizar los estudiantes
  }
  metodoEjemplo()
  {
    console.log("hola");
  }
}
