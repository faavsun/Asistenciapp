import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-repasoconceptos',
  templateUrl: './repasoconceptos.page.html',
  styleUrls: ['./repasoconceptos.page.scss'],
})
export class RepasoconceptosPage implements OnInit {

  datos:string=""
  datos_submit=""
  constructor() { }

  ngOnInit() {
  }

  enviar(){
    this.datos_submit=this.datos;
  }
}
