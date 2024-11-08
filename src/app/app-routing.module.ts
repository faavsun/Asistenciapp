import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NoAuthGuard } from './guards/no-auth.guard';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  
  

  {
    path: 'lanzamiento',
    loadChildren: () => import('./pages/login/lanzamiento/lanzamiento.module').then( m => m.LanzamientoPageModule), canActivate:[NoAuthGuard]
  },
  {
    path: '',
    redirectTo: 'lanzamiento',
    pathMatch: 'full'
  },

  {
    path: 'registro',
    loadChildren: () => import('./pages/login/registro/registro.module').then( m => m.RegistroPageModule), canActivate:[NoAuthGuard]
  },
  
  {
    path: 'olvidada',
    loadChildren: () => import('./pages/login/olvidada/olvidada.module').then( m => m.OlvidadaPageModule), canActivate:[NoAuthGuard]
  },
  
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule), canActivate:[NoAuthGuard]
  },
  
  





//========== Estudiante===========


  {
    path: 'home',
    loadChildren: () => import('./pages/main-estudiante/home/home.module').then( m => m.HomePageModule), canActivate:[AuthGuard]
  },

  {
    path: 'perfil',
    loadChildren: () => import('./pages/main-estudiante/perfil/perfil.module').then( m => m.PerfilPageModule), canActivate:[AuthGuard]
  },

  {
    path: 'ramos',
    loadChildren: () => import('./pages/main-estudiante/ramos/ramos.module').then( m => m.RamosPageModule), canActivate:[AuthGuard]
  },
  {
    path: 'marcar',
    loadChildren: () => import('./pages/main-estudiante/marcar/marcar.module').then( m => m.MarcarPageModule), canActivate:[AuthGuard]
  },
  {
    path: 'cambiar-clave',
    loadChildren: () => import('./pages/main-estudiante/cambiar-clave/cambiar-clave.module').then( m => m.CambiarClavePageModule), canActivate:[AuthGuard]
  },


    //========== Profesores===========

  {
    path: 'home-profesor',
    loadChildren: () => import('./pages/main-profesor/home-profesor/home-profesor.module').then( m => m.HomeProfesorPageModule), canActivate:[AuthGuard]
  },
  {
    path: 'ramos-profesor',
    loadChildren: () => import('./pages/main-profesor/ramos-profesor/ramos-profesor.module').then( m => m.RamosProfesorPageModule), canActivate:[AuthGuard]
  },
  {
    path: 'generar-profesor',
    loadChildren: () => import('./pages/main-profesor/generar-profesor/generar-profesor.module').then( m => m.GenerarProfesorPageModule), canActivate:[AuthGuard]
  },
  {
    path: 'lista-alumno',
    loadChildren: () => import('./pages/main-profesor/lista-alumno/lista-alumno.module').then( m => m.ListaAlumnoPageModule), canActivate:[AuthGuard]
  },

  {
    path: 'cambiar-clave-profesor',
    loadChildren: () => import('./pages/main-profesor/cambiar-clave-profesor/cambiar-clave-profesor.module').then( m => m.CambiarClaveProfesorPageModule), canActivate:[AuthGuard]
  },
  {
    path: 'perfil-profesor',
    loadChildren: () => import('./pages/main-profesor/perfil-profesor/perfil-profesor.module').then( m => m.PerfilProfesorPageModule), canActivate:[AuthGuard]
  },
  {
    path: 'main-estudiante',
    loadChildren: () => import('./pages/main-estudiante/main-estudiante.module').then( m => m.MainEstudiantePageModule), canActivate:[AuthGuard]
  },
  {
    path: 'main-profesor',
    loadChildren: () => import('./pages/main-profesor/main-profesor.module').then( m => m.MainProfesorPageModule), canActivate:[AuthGuard]
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
