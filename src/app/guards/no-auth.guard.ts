import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const sessionActive = localStorage.getItem('sessionActive');
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

    return new Promise((resolve) => {
      // Si no hay sesión activa, permite el acceso al login
      if (sessionActive === 'false') {
        resolve(true);
        return;
      }

      // Verificar el estado de autenticación en Firebase
      this.firebaseSvc.getAuth().onAuthStateChanged((auth) => {
        if (!auth) {
          resolve(true); // Usuario no autenticado, permitir acceso
        } else {
          // Usuario autenticado, redirigir según su tipo
          const userType = user ? user.tipo : null;
          if (userType === 'estudiante') {
            this.utilsSvc.routerLink('/main-estudiante/home'); // Redirige a home para estudiantes
          } else if (userType === 'profesor') {
            this.utilsSvc.routerLink('/main-profesor/home-profesor'); // Redirige a home para profesores
          }
          resolve(false); // Bloquea el acceso a páginas de no autenticados
        }
      });
    });
  }
}
