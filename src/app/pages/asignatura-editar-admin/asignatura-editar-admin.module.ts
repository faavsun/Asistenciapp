import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AsignaturaEditarAdminPageRoutingModule } from './asignatura-editar-admin-routing.module';

import { AsignaturaEditarAdminPage } from './asignatura-editar-admin.page';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AsignaturaEditarAdminPageRoutingModule,
    ComponentsModule
],
  declarations: [AsignaturaEditarAdminPage]
})
export class AsignaturaEditarAdminPageModule {}
