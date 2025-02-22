import {Component, OnDestroy, OnInit} from '@angular/core';
import {UsersService} from '../../services/users.service';
import {HttpErrorResponse} from '@angular/common/http';
import {MenuItem, MessageService} from 'primeng/api';
import {debounceTime, Subject } from 'rxjs';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PrimeNgModule} from '../../shared/modules/prime-ng/prime-ng.module';

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

  users: any[] = [];
  loading = false;
  loaded  = false;
  items: MenuItem[] = [];

  private searchSubject = new Subject<void>();
  private readonly debounceTimeMs = 500;

  constructor(private usersService: UsersService, private messageService: MessageService) {
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
      this.items = [];
    }

    this.searchSubject.next();
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }

  public findUsers() {
    this.loading = true;
    this.users = [];
    this.items = [];

    this.usersService.find(this.name, this.role).subscribe({
      next: (res: any) => {
        this.users = res;

        this.items = res.map((item: any) => {
          return {
            name: item.firstName + ' ' + item.lastName,
            username: item.username,
          }
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
