import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CambiarClaveProfesorPage } from './cambiar-clave-profesor.page';

const routes: Routes = [
  {
    path: '',
    component: CambiarClaveProfesorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CambiarClaveProfesorPageRoutingModule {}
