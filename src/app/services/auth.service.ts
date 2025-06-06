import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject, tap} from 'rxjs';
import {Router} from '@angular/router';
import {UserModel} from '../models/user.model';
import {StorageService} from './storage.service';
import {StorageModel} from '../models/storage.model';
import {PropertyModel} from '../models/property.model';
import {Roles} from '../models/role.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  baseUrl = environment.baseUrl + 'auth/';
  customerChange = new Subject<UserModel>();
  propertyChange = new Subject<PropertyModel|null>();

  constructor(private client: HttpClient, private router: Router, private storageService: StorageService) {
  }

  public get user(): UserModel {
    return this.storageService.get(StorageModel.USER);
  }

  public isAdmin() {
    return this.user.roles.map(role => role.normalizedName).includes(Roles.ADMIN);
  }

  public set user(value: UserModel) {
    this.storageService.set(StorageModel.USER, value);
  }

  public get customer(): UserModel {
    if (this.storageService.get(StorageModel.CUSTOMER))
      return this.storageService.get(StorageModel.CUSTOMER);

    return this.user;
  }

  public set customer(value: UserModel|null) {
    if (!value) {
      this.storageService.remove(StorageModel.CUSTOMER);
    } else {
      this.storageService.set(StorageModel.CUSTOMER, value);
    }

    this.setProperty();
    this.customerChange.next(this.customer);
  }

  public get property() {
    return this.storageService.get(StorageModel.PROPERTY);
  }

  public set property(value: PropertyModel|null) {
    if (!value) {
      this.storageService.remove(StorageModel.PROPERTY);
    } else {
      this.storageService.set(StorageModel.PROPERTY, value);
    }

    this.propertyChange.next(this.property);
  }

  private setProperty(property?: PropertyModel) {
    if (!property) {
      this.storageService.remove(StorageModel.PROPERTY);
    }
    this.storageService.set(StorageModel.PROPERTY, property);
  }

  public isAuthenticated(): boolean {
    return !!this.user;
  }

  login(username: string, password: string, rememberMe?: boolean): Observable<UserModel> {
    return this.client.post<UserModel>(`${this.baseUrl}login/`, {username, password, rememberMe})
      .pipe(
        tap({
          next: (res) => {
            this.user = res;
          }
        })
      );
  }

  logout() {
    this.client.post(`${this.baseUrl}logout/`, {}).subscribe(_ => {
      this.storageService.clear();

      this.router.navigate(['/login']).then();
    });
  }

  changePassword(data: any) {
    return this.client.patch<void>(`${this.baseUrl}change-password/`, data);
  }
}
