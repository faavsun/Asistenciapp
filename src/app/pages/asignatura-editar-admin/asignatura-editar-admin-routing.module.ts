import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AsignaturaEditarAdminPage } from './asignatura-editar-admin.page';

const routes: Routes = [
  {
    path: '',
    component: AsignaturaEditarAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AsignaturaEditarAdminPageRoutingModule {}
