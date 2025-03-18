import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  storage = window.localStorage;

  constructor() { }

  public get(key: string) {
    const item = this.storage.getItem(key);
    if (!item || item == 'undefined') {
      return null;
    }

    try {
      return JSON.parse(item);
    }
    catch (ex) {
      return this.storage.getItem(key);
    }
  }

  public set(key: string, value: any) {
    if (!value) {
      return this.remove(key);
    }
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
