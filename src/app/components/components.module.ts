import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncabezadoComponent } from './encabezado/encabezado.component';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';



@NgModule({
  declarations: [EncabezadoComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterLink
  ],
  exports:[EncabezadoComponent]
})
export class ComponentsModule { }
