import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  storage = window.localStorage;
  baseUrl = environment.baseUrl + 'auth/';

  constructor(private client: HttpClient, private router: Router) {
  }

  public get user(): any {
    return JSON.parse(this.storage.getItem('user') ?? 'null');
  }

  public get token(): any {
    return JSON.parse(this.storage.getItem('token') ?? 'null');
  }

  public set user(value: any) {
    this.storage.setItem('user', JSON.stringify(value));
  }

  public set token(value: any) {
    this.storage.setItem('token', JSON.stringify(value));
  }

  public isAuthenticated(): boolean {
    return !!this.token;
  }

  login(username: string, password: string): Observable<any> {
    return this.client.post(`${this.baseUrl}login/`, {username, password})
      .pipe(
        tap({
          next: (res: any) => {
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
    this.storage.removeItem('token');
    this.storage.removeItem('user');

    location.reload();
  }
}
