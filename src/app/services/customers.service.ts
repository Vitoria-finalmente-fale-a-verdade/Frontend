import {EventEmitter, Injectable} from '@angular/core';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  storage = window.sessionStorage;
  selectedCustomerKey = 'customer';
  selectedCustomerChange = new EventEmitter();

  constructor(private authService: AuthService) { }

  public get selectedCustomer(): any {
    const customer = this.storage.getItem(this.selectedCustomerKey);
    if (!customer)
      return this.authService.user;

    return JSON.parse(customer);
  }

  public set selectedCustomer(value: any) {
    this.selectedCustomerChange.emit(value);
    this.storage.setItem(this.selectedCustomerKey, JSON.stringify(value));
  }
}
