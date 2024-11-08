import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LanzamientoPage } from './lanzamiento.page';

const routes: Routes = [
  {
    path: '',
    component: LanzamientoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LanzamientoPageRoutingModule {}
