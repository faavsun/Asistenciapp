import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AsignaturaAdminPage } from './asignatura-admin.page';

const routes: Routes = [
  {
    path: '',
    component: AsignaturaAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AsignaturaAdminPageRoutingModule {}
