
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  // Método para guardar datos en localStorage
  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Método para obtener datos de localStorage
  getItem(key: string): any {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  // Método para eliminar un elemento de localStorage
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Método para limpiar todo el localStorage
  clear(): void {
    localStorage.clear();
  }
}
