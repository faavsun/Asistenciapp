import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarcarPage } from './marcar.page';

const routes: Routes = [
  {
    path: '',
    component: MarcarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarcarPageRoutingModule {}
