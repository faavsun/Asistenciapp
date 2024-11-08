import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilProfesorPage } from './perfil-profesor.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilProfesorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilProfesorPageRoutingModule {}
