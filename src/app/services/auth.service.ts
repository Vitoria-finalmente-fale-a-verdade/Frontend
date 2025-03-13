import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {Router} from '@angular/router';
import {UserModel} from '../models/user.model';
import {TokenResponseModel} from '../models/token-response.model';
import {StorageService} from './storage.service';
import {StorageModel} from '../models/storage.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  baseUrl = environment.baseUrl + 'auth/';

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
    this.storageService.remove(StorageModel.TOKEN);
    this.storageService.remove(StorageModel.USER);
    this.storageService.remove(StorageModel.CUSTOMER);

    this.router.navigate(['/login']).then();
  }

  logoutReload() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('customer');

    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('customer');

    location.reload();
  }

  changePassword(data: any) {
    return this.client.patch<void>(`${this.baseUrl}change-password/`, data);
  }
}
