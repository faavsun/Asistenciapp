import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InscribirSeccionPageRoutingModule } from './inscribir-seccion-routing.module';

import { InscribirSeccionPage } from './inscribir-seccion.page';
import { ComponentsModule } from "../../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InscribirSeccionPageRoutingModule,
    ComponentsModule
],
  declarations: [InscribirSeccionPage]
})
export class InscribirSeccionPageModule {}
