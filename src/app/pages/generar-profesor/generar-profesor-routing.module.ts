import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GenerarProfesorPage } from './generar-profesor.page';

const routes: Routes = [
  {
    path: '',
    component: GenerarProfesorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenerarProfesorPageRoutingModule {}
