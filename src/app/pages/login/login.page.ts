
import { Component } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  constructor(private localStorageService: LocalStorageService) {}

  login(user: any): void {
    const userData = { id: user.id, name: user.name, token: 'fake-token' };
    this.localStorageService.setItem('user', userData);
    console.log('Usuario guardado en localStorage:', userData);
  }

  getUserData(): void {
    const user = this.localStorageService.getItem('user');
    console.log('Datos del usuario desde localStorage:', user);
  }

  logout(): void {
    this.localStorageService.removeItem('user');
    console.log('Usuario eliminado de localStorage');
  }
}
