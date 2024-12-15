import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }


  setIfNotExists(key: string, value: any) {
    const existingData = localStorage.getItem(key);
    if (!existingData) {
      console.log(`Guardando en localStorage porque no existe la clave: ${key}`);
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  get(key: string): any {
    const value = localStorage.getItem(key);
    try {
      return value ? JSON.parse(value) : null;
    } catch {
      return value;
    }
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }
}