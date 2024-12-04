import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, MenuController } from '@ionic/angular';
import { catchError, of } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-lista-alumno',
  templateUrl: './lista-alumno.page.html',
  styleUrls: ['./lista-alumno.page.scss'],
})
export class ListaAlumnoPage implements OnInit {
  seccionId: string = '';
  estudiantes: any[] = []; // Lista de estudiantes para mostrar
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  localStorageSvc = inject(LocalStorageService);

  constructor(private route: ActivatedRoute, private navCtrl: NavController, private menuCtrl: MenuController) {}

  ngOnInit() {
    this.seccionId = this.route.snapshot.paramMap.get('seccionId') || '';
    console.log('ID de sección a buscar:', this.seccionId);

    if (this.seccionId) {
      this.getEstudiantes(this.seccionId);
    } else {
      console.error('Sección ID no proporcionado');
    }
  }

  goBack() {
    this.navCtrl.back(); // Navega a la vista anterior
  }

  async getEstudiantes(seccionId: string) {
    const isConnected = await this.utilsSvc.checkInternetConnection();

    if (isConnected) {
      // Si hay conexión, obtiene los datos del servidor
      this.firebaseSvc.getEstudiantesBySeccion(seccionId).pipe(
        catchError(error => {
          console.error('Error al obtener estudiantes:', error);
          return of([]); // Retorna un observable vacío en caso de error
        })
      ).subscribe(async data => {
        console.log(`Estudiantes obtenidos del servidor para la sección ${seccionId}:`, data);
        this.estudiantes = data;

        // Guarda los datos en el almacenamiento local bajo una clave única
        await this.localStorageSvc.set(`estudiantes_${seccionId}`, data);
      });
    } else {
      // Si no hay conexión, carga los datos del almacenamiento local
      console.log(`No hay conexión. Cargando datos de la sección ${seccionId} desde el almacenamiento local...`);
      this.estudiantes = await this.localStorageSvc.get(`estudiantes_${seccionId}`) || [];
      console.log(`Estudiantes cargados desde el almacenamiento local para la sección ${seccionId}:`, this.estudiantes);
    }
  }
}
