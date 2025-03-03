import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {Router} from '@angular/router';
import {UserModel} from '../models/user.model';
import {TokenResponseModel} from '../models/token-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  storage = window.localStorage;
  baseUrl = environment.baseUrl + 'auth/';

  constructor(private client: HttpClient, private router: Router) {
  }

  public get user(): UserModel {
    return JSON.parse(this.storage.getItem('user') ?? 'null');
  }

  public get token(): string {
    return this.storage.getItem('token') ?? '';
  }

  public set user(value: UserModel) {
    this.storage.setItem('user', JSON.stringify(value));
  }

  public set token(value: string) {
    this.storage.setItem('token', value);
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
    this.storage.removeItem('token');
    this.storage.removeItem('user');

    this.router.navigate(['/login']).then();
  }

  logoutReload() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');

    location.reload();
  }

  changePassword(data: any) {
    return this.client.patch<void>(`${this.baseUrl}change-password/`, data);
  }
}
