import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  usr:Usuario={
    username:'',
    password:''
  }
  constructor(private router:Router) { }

  ngOnInit() {
  }

  iniciarSesion(){
    console.log("Subimit del formulario");
    if(this.usr.username=="waco" && this.usr.password=="123"){
      console.log('autorizado!!!');
      this.router.navigate(["/home"])
    }
    else if(this.usr.username=="paco" && this.usr.password=="123"){
      console.log('autorizado!!!');
      this.router.navigate(["/ramos"])
    }
    else{
      console.log("Pa la casa!!!");
    }

  }

}
