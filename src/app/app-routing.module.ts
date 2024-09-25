import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'botones',
    loadChildren: () => import('./pages/botones/botones.module').then( m => m.BotonesPageModule)
  },
  {
    path: 'alertas',
    loadChildren: () => import('./pages/alertas/alertas.module').then( m => m.AlertasPageModule)
  },
  {
    path: 'repasoconceptos',
    loadChildren: () => import('./pages/repasoconceptos/repasoconceptos.module').then( m => m.RepasoconceptosPageModule)
  },
  {
    path: 'ramos',
    loadChildren: () => import('./pages/ramos/ramos.module').then( m => m.RamosPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },  {
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
    path: 'home-admin',
    loadChildren: () => import('./pages/home-admin/home-admin.module').then( m => m.HomeAdminPageModule)
  },
  {
    path: 'ramos-admin',
    loadChildren: () => import('./pages/ramos-admin/ramos-admin.module').then( m => m.RamosAdminPageModule)
  },
  {
    path: 'asignatura-admin',
    loadChildren: () => import('./pages/asignatura-admin/asignatura-admin.module').then( m => m.AsignaturaAdminPageModule)
  },
  {
    path: 'asignatura-editar-admin',
    loadChildren: () => import('./pages/asignatura-editar-admin/asignatura-editar-admin.module').then( m => m.AsignaturaEditarAdminPageModule)
  },
  {
    path: 'lista-alumno',
    loadChildren: () => import('./pages/lista-alumno/lista-alumno.module').then( m => m.ListaAlumnoPageModule)
  },





];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
