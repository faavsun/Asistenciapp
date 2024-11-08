import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LanzamientoPageRoutingModule } from './lanzamiento-routing.module';

import { LanzamientoPage } from './lanzamiento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LanzamientoPageRoutingModule
  ],
  declarations: [LanzamientoPage]
})
export class LanzamientoPageModule {}
