import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CambiarClaveProfesorPageRoutingModule } from './cambiar-clave-profesor-routing.module';

import { CambiarClaveProfesorPage } from './cambiar-clave-profesor.page';
import { ComponentsModule } from "../../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CambiarClaveProfesorPageRoutingModule,
    ComponentsModule
],
  declarations: [CambiarClaveProfesorPage]
})
export class CambiarClaveProfesorPageModule {}
