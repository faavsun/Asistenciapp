import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  canActivate(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return new Promise((resolve) => {
      this.firebaseSvc.getAuth().onAuthStateChanged((auth) => {
        if (auth) {
          const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

          if (user) {
            const path = route.url.map(segment => segment.path).join('/'); // Obtener el path completo
            let redirectPath = ''; // Variable para almacenar la ruta de redirección
            let isValidRoute = false;

            if (user.tipo === 'estudiante') {
              const studentPages = [
                'main-estudiante',
                'main-estudiante/home',
                'main-estudiante/perfil',
                'main-estudiante/amos',
                'main-estudiante/marcar',
                'main-estudiante/cambiar-clave'
              ];

              isValidRoute = studentPages.includes(path);
              if (!isValidRoute) {
                redirectPath = '/main-estudiante/home'; // Establecer la ruta de redirección para estudiantes
              }
            } else if (user.tipo === 'profesor') {
              const professorPages = [
                'main-profesor',
                'main-profesor/home-profesor',
                'main-profesor/perfil-profesor',
                'main-profesor/ramos-profesor',
                'main-profesor/generar-profesor',
                'main-profesor/lista-alumno',
                'main-profesor/cambiar-clave-profesor'
              ];
              console.log('Rutas válidas para profesor:', professorPages);
              isValidRoute = professorPages.includes(path);
              console.log('¿Ruta válida para profesor?', isValidRoute);
              if (!isValidRoute) {
                redirectPath = '/main-profesor/home-profesor'; // Establecer la ruta de redirección para profesores
              }
            }

            // Si la ruta no es válida, redirigir
            if (!isValidRoute) {
              this.utilsSvc.routerLink(redirectPath);
            }
            resolve(isValidRoute); // Retorna true o false según la validez de la ruta
          } else {
            this.utilsSvc.routerLink('/login');
            resolve(false);
          }
        } else {
          this.utilsSvc.routerLink('/login');
          resolve(false);
        }
      });
    });
  }
}