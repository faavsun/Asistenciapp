import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilProfesorPageRoutingModule } from './perfil-profesor-routing.module';

import { PerfilProfesorPage } from './perfil-profesor.page';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilProfesorPageRoutingModule,
    ComponentsModule
],
  declarations: [PerfilProfesorPage]
})
export class PerfilProfesorPageModule {}
