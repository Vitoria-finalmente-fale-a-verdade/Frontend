import {Component, OnDestroy, OnInit} from '@angular/core';
import {UsersService} from '../../services/users.service';
import {HttpErrorResponse} from '@angular/common/http';
import {MessageService} from 'primeng/api';
import {debounceTime, Subject } from 'rxjs';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PrimeNgModule} from '../../shared/modules/prime-ng/prime-ng.module';
import {UserModel} from '../../models/user.model';
import {Roles} from '../../models/role.model';
import {AuthService} from '../../services/auth.service';

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
  role: string = Roles.CUSTOMER;
  customer?: UserModel;

  users: UserModel[] = [];
  name: string = '';
  loading = false;
  loaded  = false;

  private searchSubject = new Subject<string>();
  private readonly debounceTimeMs = 500;

  constructor(
    private usersService: UsersService,
    private messageService: MessageService,
    public authService: AuthService,
  ) { }

  ngOnInit() {
    this.customer = this.authService.customer;
    if (this.customer) {
      this.users = [this.customer];
    }

    this.searchSubject.pipe(debounceTime(this.debounceTimeMs)).subscribe(name => {
      this.loaded = false;
      if (name.trim() !== '') {
        this.findUsers(name);
      }
    });
  }

  changeName(name: string) {
    this.name = name;

    if (name.trim() == '') {
      this.users = [];
    }

    this.searchSubject.next(name);
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }

  public selectCustomer(customer: UserModel|null) {
    this.authService.customer = customer;
  }

  public findUsers(name: string) {
    this.loading = true;
    this.users = this.customer ? [this.customer] : [];

    this.usersService.find(name, this.role).subscribe({
      next: (res: UserModel[]) => {
        this.users = res.map(user => {
          let item: any;
          item = user;
          item.fullName = [user.firstName, user.lastName].join(' ');

          return item;
        });
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
