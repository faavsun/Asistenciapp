import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AsignaturaAdminPageRoutingModule } from './asignatura-admin-routing.module';

import { AsignaturaAdminPage } from './asignatura-admin.page';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AsignaturaAdminPageRoutingModule,
    ComponentsModule
],
  declarations: [AsignaturaAdminPage]
})
export class AsignaturaAdminPageModule {}
