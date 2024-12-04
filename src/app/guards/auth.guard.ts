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
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

      // Si no hay usuario en localStorage, redirigir al login
      if (!user) {
        this.utilsSvc.routerLink('/login');
        resolve(false);
        return;
      }

      // Verificar el estado de autenticación en Firebase
      if (navigator.onLine) {  // Si hay conexión a internet, comprobar en Firebase
        this.firebaseSvc.getAuth().onAuthStateChanged((auth) => {
          if (!auth) {
            // Si no está autenticado en Firebase, redirigir al login
            this.utilsSvc.routerLink('/login');
            resolve(false);
            return;
          }

          // Si está autenticado en Firebase, permitir el acceso según su tipo de usuario
          this.checkRoutePermission(route, user, resolve);
        });
      } else {
        // Si está offline, usar localStorage para validar el acceso
        this.checkRoutePermission(route, user, resolve);
      }
    });
  }

  private checkRoutePermission(route: ActivatedRouteSnapshot, user: any, resolve: any) {
    const path = route.url.map(segment => segment.path).join('/');
    const userType = user.tipo;

    let isValidRoute = false;
    if (userType === 'estudiante') {
      const studentPages = [
        'main-estudiante',
        'main-estudiante/home',
        'main-estudiante/perfil',
        'main-estudiante/ramos',
        'main-estudiante/marcar',
        'main-estudiante/cambiar-clave'
      ];
      isValidRoute = studentPages.includes(path);
    } else if (userType === 'profesor') {
      const professorPages = [
        'main-profesor',
        'main-profesor/home-profesor',
        'main-profesor/perfil-profesor',
        'main-profesor/ramos-profesor',
        'main-profesor/generar-profesor',
        'main-profesor/lista-alumno',
        'main-profesor/cambiar-clave-profesor'
      ];
      isValidRoute = professorPages.includes(path);
    }

    if (!isValidRoute) {
      this.utilsSvc.routerLink('/login');
      resolve(false);
    } else {
      resolve(true);
    }
  }
}
