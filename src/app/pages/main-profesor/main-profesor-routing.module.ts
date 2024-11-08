import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainProfesorPage } from './main-profesor.page';

const routes: Routes = [
  {
    path: '',
    component: MainProfesorPage,
    children:[
      {
        path: 'home-profesor',
        loadChildren: () => import('../../pages/main-profesor/home-profesor/home-profesor.module').then( m => m.HomeProfesorPageModule)
      },
      {
        path: 'perfil-profesor',
        loadChildren: () => import('../../pages/main-profesor/perfil-profesor/perfil-profesor.module').then( m => m.PerfilProfesorPageModule)
      },  {
        path: 'ramos-profesor/:seccionId',
        loadChildren: () => import('../../pages/main-profesor/ramos-profesor/ramos-profesor.module').then( m => m.RamosProfesorPageModule)
      },
      {
        path: 'generar-profesor/:seccionId',
        loadChildren: () => import('../../pages/main-profesor/generar-profesor/generar-profesor.module').then( m => m.GenerarProfesorPageModule)
      },
      {
        path: 'lista-alumno/:seccionId',
        loadChildren: () => import('../../pages/main-profesor/lista-alumno/lista-alumno.module').then( m => m.ListaAlumnoPageModule)
      },
    
      {
        path: 'cambiar-clave-profesor',
        loadChildren: () => import('../../pages/main-profesor/cambiar-clave-profesor/cambiar-clave-profesor.module').then( m => m.CambiarClaveProfesorPageModule)
      },
      {
        path: '**',
        redirectTo: 'home-profesor', // O cualquier otra página que desees
        pathMatch: 'full'
      }



    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainProfesorPageRoutingModule {}
