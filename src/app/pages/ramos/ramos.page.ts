import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ramos',
  templateUrl: './ramos.page.html',
  styleUrls: ['./ramos.page.scss'],
})
export class RamosPage implements OnInit {

  public actionSheetButtons = [
    {
      text: 'Perfil',
      handler:()=>{
        this.router.navigate(['/repasoconceptos']); //para el perfil
        this.metodoEjemplo();
      },
      
      data: {
        action: 'share',
      },
    },
    {
      text: 'Cerrar sesion',
      role: 'destructive',
      handler:()=>{
        this.router.navigate(['/botones']); //aca es para cerrar la sesion
        this.metodoEjemplo();
      },
      data: {
        action: 'delete',
      },
    },
    {
      text: 'Cancelar',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];




  asignaturas: string[] = ['Matemáticas', 'Historia', 'Biología', 'Química', 'Inglés', 'Física'];

  constructor(private router:Router) { }

  ngOnInit() {
  }
  metodoEjemplo()
  {
    console.log("hola");
  }
}
