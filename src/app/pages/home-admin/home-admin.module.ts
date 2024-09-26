import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeAdminPageRoutingModule } from './home-admin-routing.module';

import { HomeAdminPage } from './home-admin.page';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeAdminPageRoutingModule,
    ComponentsModule
],
  declarations: [HomeAdminPage]
})
export class HomeAdminPageModule {}
