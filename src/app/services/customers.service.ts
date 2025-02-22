import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  selectedCustomerKey = 'customer';
  selectedCustomerChange = new EventEmitter();

  constructor() { }

  public get selectedCustomer(): any {
    return JSON.parse(localStorage.getItem(this.selectedCustomerKey) ?? 'null');
  }

  public set selectedCustomer(value: any) {
    this.selectedCustomerChange.emit(value);
    localStorage.setItem(this.selectedCustomerKey, JSON.stringify(value));
  }
}
