
import { Component } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  constructor(
    private localStorageService: LocalStorageService,
    private firebaseService: FirebaseService
  ) {}

  async login(user: any): Promise<void> {
    try {
      const userData = await this.firebaseService.login(user);
      this.localStorageService.setItem('user', userData);
      console.log('Usuario autenticado y guardado:', userData);
    } catch (error) {
      console.error('Error en el login con Firebase:', error);
      const fallbackUser = this.localStorageService.getItem('user');
      if (fallbackUser) {
        console.log('Cargando usuario desde localStorage como respaldo:', fallbackUser);
      } else {
        console.error('No hay datos de respaldo en localStorage.');
      }
    }
  }

  logout(): void {
    this.firebaseService.logout();
    this.localStorageService.removeItem('user');
    console.log('Sesión cerrada y datos locales eliminados.');
  }
}
