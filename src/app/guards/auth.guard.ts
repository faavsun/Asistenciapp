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
      const sessionActive = localStorage.getItem('sessionActive');
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

      // Verificar si no hay sesión activa o no hay datos del usuario
      if (sessionActive === 'false' || !user) {
        this.utilsSvc.routerLink('/login'); // Redirige al login
        resolve(false);
        return;
      }

      // Verificar autenticación con Firebase en modo online
      if (navigator.onLine) {
        this.firebaseSvc.getAuth().onAuthStateChanged((auth) => {
          if (!auth) {
            this.utilsSvc.routerLink('/login'); // Si no está autenticado, redirige al login
            resolve(false);
            return;
          }

          // Si está autenticado en Firebase, validar las rutas
          this.checkRoutePermission(route, user, resolve);
        });
      } else {
        // En modo offline, validar solo con localStorage
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
      this.utilsSvc.routerLink('/login'); // Si la ruta no es válida, redirige al login
      resolve(false);
    } else {
      resolve(true); // Permite el acceso si la ruta es válida
    }
  }
}
