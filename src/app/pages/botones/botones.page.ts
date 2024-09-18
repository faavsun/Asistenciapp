import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-botones',
  templateUrl: './botones.page.html',
  styleUrls: ['./botones.page.scss'],
})
export class BotonesPage implements OnInit {

  mensaje:string='';
  
  constructor(private router:Router) { }

  ngOnInit() {
    console.log("Esto es on init");
  }

  onClick(){
    console.log("Evento disparado!!!");
    this.mensaje="Hola desde el evento";
  }


  navegar(){
    this.router.navigate(['/home'])
  }

}
