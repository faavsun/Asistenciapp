import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPage } from './login.page';

const routes: Routes = [
  {
    path: '',
    component: LoginPage,
    children:[
    {
      path: 'registro',
      loadChildren: () => import('../../pages/login/registro/registro.module').then( m => m.RegistroPageModule)
    },
    
    {
      path: 'olvidada',
      loadChildren: () => import('../../pages/login/olvidada/olvidada.module').then( m => m.OlvidadaPageModule)
    },
  ]
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}
