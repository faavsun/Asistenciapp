import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ramos',
  templateUrl: './ramos.page.html',
  styleUrls: ['./ramos.page.scss'],
})
export class RamosPage implements OnInit {






  

  constructor(private router:Router) { }

  ngOnInit() {
  }
  Marcar() {
    this.router.navigate(['/marcar'])
  }
  metodoEjemplo()
  {
    console.log("hola");
  }
}
