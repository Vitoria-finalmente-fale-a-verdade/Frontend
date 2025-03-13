import {EventEmitter, Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {UserModel} from '../models/user.model';
import {StorageService} from './storage.service';
import {StorageModel} from '../models/storage.model';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  selectedCustomerChange = new EventEmitter();

  constructor(private authService: AuthService, private storageService: StorageService) { }

  public get selectedCustomer(): UserModel {
    const customer = this.storageService.get(StorageModel.CUSTOMER);
    if (!customer)
      return this.authService.user;

    return JSON.parse(customer);
  }

  public set selectedCustomer(value: UserModel) {
    this.selectedCustomerChange.emit(value);
    this.storageService.set(StorageModel.CUSTOMER, value);
  }
}
