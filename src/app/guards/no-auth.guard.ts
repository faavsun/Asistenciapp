import { Injectable,inject } from '@angular/core';
import { ActivatedRouteSnapshot ,CanActivate, GuardResult, MaybeAsync, RouterStateSnapshot,UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';

@Injectable({
  providedIn: 'root'
})


export class NoAuthGuard implements CanActivate{
  
  firebaseSvc = inject(FirebaseService)
  utilsSvc = inject(UtilsService)
  
  canActivate(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      let user = localStorage.getItem('user');
  
      return new Promise((resolve) => {
        this.firebaseSvc.getAuth().onAuthStateChanged((auth)=> {
          if(!auth){
            resolve(true);
          }else {
            // Obtiene el tipo de usuario desde localStorage
            const userType = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).tipo : null;
            
            if (userType === 'estudiante') {
              this.utilsSvc.routerLink('/main-estudiante/home');  // Redirige a home para estudiantes
            } else if (userType === 'profesor') {
              this.utilsSvc.routerLink('/main-profesor/home-profesor');  // Redirige a home-profesor para profesores
            }
            resolve(false);  // Impide acceso a páginas de no autenticados
          }
        })
      });
    }
};