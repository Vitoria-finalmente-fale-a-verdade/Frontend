import {Component, OnDestroy, OnInit} from '@angular/core';
import {UsersService} from '../../services/users.service';
import {HttpErrorResponse} from '@angular/common/http';
import {MessageService} from 'primeng/api';
import {debounceTime, Subject } from 'rxjs';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PrimeNgModule} from '../../shared/modules/prime-ng/prime-ng.module';
import {CustomersService} from '../../services/customers.service';
import {User} from '../../models/user.model';

@Component({
  selector: 'app-select-customer',
  standalone: true,
  imports: [
    CommonModule,
    PrimeNgModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './select-customer.component.html',
  styleUrl: './select-customer.component.css'
})
export class SelectCustomerComponent implements OnInit, OnDestroy {
  name: string = '';
  role: string = 'CUSTOMER';

  users: User[] = [];
  loading = false;
  loaded  = false;

  private searchSubject = new Subject<void>();
  private readonly debounceTimeMs = 500;

  constructor(
    private usersService: UsersService,
    private messageService: MessageService,
    private customersService: CustomersService) {
  }

  ngOnInit() {
    this.searchSubject.pipe(debounceTime(this.debounceTimeMs)).subscribe(() => {
      this.loaded = false;
      if (this.name.trim() !== '') {
        this.findUsers();
      }
    });
  }

  changeName() {
    if (this.name.trim() == '') {
      this.users = [];
    }

    this.searchSubject.next();
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }

  public selectCustomer(customer: User) {
    this.name = '';
    this.users = [];
    this.customersService.selectedCustomer = customer;
  }

  public findUsers() {
    this.loading = true;
    this.users = [];

    this.usersService.find(this.name, this.role).subscribe({
      next: (res: User[]) => {
        this.users = res;
      },
      error: (err: HttpErrorResponse) => {
        this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Erro ao carregar clientes'});
        console.error(err);
      },
      complete: () => {
        this.loaded = true;
        this.loading = false;
      }
    });
  }
}
