import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  selectedMenuId: string = 'first'; // Valor por defecto, puede cambiarse según la vista
  constructor() {}
}
