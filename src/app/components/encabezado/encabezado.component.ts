import { Component, Input, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { MenuItem } from 'src/app/interfaces/menu-item';

@Component({
  selector: 'app-encabezado',
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.scss'],
})
export class EncabezadoComponent  implements OnInit {
  

  @Input() titulo="";
  constructor(private menuCtrl: MenuController) { }
  
  ngOnInit() {}

  
}
