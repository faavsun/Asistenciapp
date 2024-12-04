import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  // Método para guardar datos en localStorage
  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Método para obtener datos de localStorage
  get(key: string): any {
    const value = localStorage.getItem(key);
    try {
      return value ? JSON.parse(value) : null;
    } catch {
      // Si no es un JSON válido, devolver el valor como está (cadena simple)
      return value;
    }
  }

  // Método para eliminar un valor del localStorage
  remove(key: string) {
    localStorage.removeItem(key);
  }

  // Método para limpiar todo el localStorage
  clear() {
    localStorage.clear();
  }
}