import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainProfesorPageRoutingModule } from './main-profesor-routing.module';

import { MainProfesorPage } from './main-profesor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainProfesorPageRoutingModule
  ],
  declarations: [MainProfesorPage]
})
export class MainProfesorPageModule {}
