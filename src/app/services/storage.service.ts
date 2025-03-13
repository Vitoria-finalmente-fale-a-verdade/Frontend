import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  storage = window.localStorage;

  constructor() { }

  public get(key: string) {
    try {
      return JSON.parse(this.storage.getItem(key)!);
    }
    catch (ex) {
      return this.storage.getItem(key);
    }
  }

  public set(key: string, value: any) {
    try {
      value = JSON.stringify(value);
    }
    catch (ex) {}
    this.storage.setItem(key, value);
  }

  public remove(key: string) {
    this.storage.removeItem(key);
  }

  public clear() {
    this.storage.clear();
  }
}
