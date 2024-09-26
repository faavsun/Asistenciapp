import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeProfesorPageRoutingModule } from './home-profesor-routing.module';

import { HomeProfesorPage } from './home-profesor.page';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeProfesorPageRoutingModule,
    ComponentsModule
],
  declarations: [HomeProfesorPage]
})
export class HomeProfesorPageModule {}
