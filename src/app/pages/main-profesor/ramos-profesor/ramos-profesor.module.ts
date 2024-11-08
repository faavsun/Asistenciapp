import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RamosProfesorPageRoutingModule } from './ramos-profesor-routing.module';

import { RamosProfesorPage } from './ramos-profesor.page';
import { ComponentsModule } from "../../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RamosProfesorPageRoutingModule,
    ComponentsModule
],
  declarations: [RamosProfesorPage]
})
export class RamosProfesorPageModule {}
