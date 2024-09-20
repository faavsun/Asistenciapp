import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-lanzamiento',
  templateUrl: './lanzamiento.page.html',
  styleUrls: ['./lanzamiento.page.scss'],
})
export class LanzamientoPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  async Lanzamiento() {

    {
      this.router.navigate(['/login']);
    }
  }

  async Lanzamiento2() {

    {
      this.router.navigate(['/registro']);
    }
  }
}

