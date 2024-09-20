import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RamosAdminPageRoutingModule } from './ramos-admin-routing.module';

import { RamosAdminPage } from './ramos-admin.page';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RamosAdminPageRoutingModule,
    ComponentsModule
],
  declarations: [RamosAdminPage]
})
export class RamosAdminPageModule {}
