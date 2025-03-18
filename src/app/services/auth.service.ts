import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject, tap} from 'rxjs';
import {Router} from '@angular/router';
import {UserModel} from '../models/user.model';
import {TokenResponseModel} from '../models/token-response.model';
import {StorageService} from './storage.service';
import {StorageModel} from '../models/storage.model';
import {PropertyModel} from '../models/property.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  baseUrl = environment.baseUrl + 'auth/';
  customerChange = new Subject<UserModel>();
  propertyChange = new Subject<PropertyModel>();

  constructor(private client: HttpClient, private router: Router, private storageService: StorageService) {
  }

  public get user(): UserModel {
    return this.storageService.get(StorageModel.USER);
  }

  public get token(): string {
    return this.storageService.get(StorageModel.TOKEN);
  }

  public set user(value: UserModel) {
    this.storageService.set(StorageModel.USER, value);
  }

  public set token(value: string) {
    this.storageService.set(StorageModel.TOKEN, value);
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
    this.customerChange.next(value!);
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

    this.propertyChange.next(value!);
  }

  private setProperty(property?: PropertyModel) {
    if (!property) {
      this.storageService.remove(StorageModel.PROPERTY);
    }
    this.storageService.set(StorageModel.PROPERTY, property);
  }

  public isAuthenticated(): boolean {
    return !!this.token;
  }

  login(username: string, password: string): Observable<TokenResponseModel> {
    return this.client.post<TokenResponseModel>(`${this.baseUrl}login/`, {username, password})
      .pipe(
        tap({
          next: (res) => {
            this.token = res.token;
            this.user = res.user;
          }
        })
      );
  }

  logout() {
    this.storageService.clear();

    this.router.navigate(['/login']).then();
  }

  changePassword(data: any) {
    return this.client.patch<void>(`${this.baseUrl}change-password/`, data);
  }
}
