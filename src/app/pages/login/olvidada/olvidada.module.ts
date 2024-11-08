import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OlvidadaPageRoutingModule } from './olvidada-routing.module';

import { OlvidadaPage } from './olvidada.page';
import { ComponentsModule } from "../../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OlvidadaPageRoutingModule,
    ComponentsModule
  ],
  declarations: [OlvidadaPage]
})
export class OlvidadaPageModule { }
