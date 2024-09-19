import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RamosProfesorPage } from './ramos-profesor.page';

const routes: Routes = [
  {
    path: '',
    component: RamosProfesorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RamosProfesorPageRoutingModule {}
