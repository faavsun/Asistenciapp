import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'lanzamiento',
    loadChildren: () => import('./pages/lanzamiento/lanzamiento.module').then( m => m.LanzamientoPageModule)
  },



  {
    path: '',
    redirectTo: 'lanzamiento',
    pathMatch: 'full'
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule)
  },

  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },





  {
    path: 'olvidada',
    loadChildren: () => import('./pages/olvidada/olvidada.module').then( m => m.OlvidadaPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
  },

  {
    path: 'ramos',
    loadChildren: () => import('./pages/ramos/ramos.module').then( m => m.RamosPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'marcar',
    loadChildren: () => import('./pages/marcar/marcar.module').then( m => m.MarcarPageModule)
  },
  {
    path: 'home-profesor',
    loadChildren: () => import('./pages/home-profesor/home-profesor.module').then( m => m.HomeProfesorPageModule)
  },
  {
    path: 'ramos-profesor',
    loadChildren: () => import('./pages/ramos-profesor/ramos-profesor.module').then( m => m.RamosProfesorPageModule)
  },
  {
    path: 'generar-profesor',
    loadChildren: () => import('./pages/generar-profesor/generar-profesor.module').then( m => m.GenerarProfesorPageModule)
  },
  {
    path: 'lista-alumno',
    loadChildren: () => import('./pages/lista-alumno/lista-alumno.module').then( m => m.ListaAlumnoPageModule)
  },
  {
    path: 'cambiar-clave',
    loadChildren: () => import('./pages/cambiar-clave/cambiar-clave.module').then( m => m.CambiarClavePageModule)
  },





];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
