import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OlvidadaPage } from './olvidada.page';

const routes: Routes = [
  {
    path: '',
    component: OlvidadaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OlvidadaPageRoutingModule {}
