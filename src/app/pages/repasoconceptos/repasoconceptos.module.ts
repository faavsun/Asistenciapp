import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RepasoconceptosPageRoutingModule } from './repasoconceptos-routing.module';

import { RepasoconceptosPage } from './repasoconceptos.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RepasoconceptosPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [RepasoconceptosPage]
})
export class RepasoconceptosPageModule {}
