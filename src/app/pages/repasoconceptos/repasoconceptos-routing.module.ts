import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RepasoconceptosPage } from './repasoconceptos.page';

const routes: Routes = [
  {
    path: '',
    component: RepasoconceptosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RepasoconceptosPageRoutingModule {}
