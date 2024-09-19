import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GenerarProfesorPageRoutingModule } from './generar-profesor-routing.module';

import { GenerarProfesorPage } from './generar-profesor.page';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GenerarProfesorPageRoutingModule,
    ComponentsModule
],
  declarations: [GenerarProfesorPage]
})
export class GenerarProfesorPageModule {}
