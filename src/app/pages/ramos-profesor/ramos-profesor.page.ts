import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-ramos-profesor',
  templateUrl: './ramos-profesor.page.html',
  styleUrls: ['./ramos-profesor.page.scss'],
})
export class RamosProfesorPage implements OnInit {


  constructor(private router:Router,private appComponent: AppComponent) { }

  ngOnInit() {
    this.appComponent.selectedMenuId = 'profesor-menu';
  }
  Generar() {
    this.router.navigate(['/generar-profesor'])
  }
  Lista() {
    this.router.navigate(['/lista-alumno'])
  }
  metodoEjemplo()
  {
    console.log("hola");
  }
}
