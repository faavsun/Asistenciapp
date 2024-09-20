import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MarcarPageRoutingModule } from './marcar-routing.module';

import { MarcarPage } from './marcar.page';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MarcarPageRoutingModule,
    ComponentsModule
],
  declarations: [MarcarPage]
})
export class MarcarPageModule {}
