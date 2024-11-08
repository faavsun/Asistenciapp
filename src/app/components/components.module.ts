import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncabezadoComponent } from './encabezado/encabezado.component';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { CustomInputComponent } from './custom-input/custom-input.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; // Importa aquí


@NgModule({
  declarations: [EncabezadoComponent,CustomInputComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterLink,
    ReactiveFormsModule,
    FormsModule
  ],
  exports:[EncabezadoComponent,CustomInputComponent,ReactiveFormsModule]
})
export class ComponentsModule { }
