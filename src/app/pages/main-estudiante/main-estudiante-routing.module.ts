import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainEstudiantePage } from './main-estudiante.page';

const routes: Routes = [
  {
    path: '',
    component: MainEstudiantePage,
    children:[
      {
        path: 'home',
        loadChildren: () => import('../../pages/main-estudiante/home/home.module').then( m => m.HomePageModule)
      },
    
      {
        path: 'perfil',
        loadChildren: () => import('../../pages/main-estudiante/perfil/perfil.module').then( m => m.PerfilPageModule)
      },  
      {
        path: 'ramos/:seccionId',
        loadChildren: () => import('../../pages/main-estudiante/ramos/ramos.module').then( m => m.RamosPageModule)
      },
      {
        path: 'marcar/:seccionId',
        loadChildren: () => import('../../pages/main-estudiante/marcar/marcar.module').then( m => m.MarcarPageModule)
      },
      {
        path: 'cambiar-clave',
        loadChildren: () => import('../../pages/main-estudiante/cambiar-clave/cambiar-clave.module').then( m => m.CambiarClavePageModule)
      },
      {
        path: '**',
        redirectTo: 'home', // O cualquier otra página que desees
        pathMatch: 'full'
      }

    
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainEstudiantePageRoutingModule {}
