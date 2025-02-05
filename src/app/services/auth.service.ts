import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = environment.baseUrl + 'auth/';

  constructor(private client: HttpClient, private router: Router) {
  }

  public get user(): any {
    return JSON.parse(localStorage.getItem('user') ?? 'null');
  }

  public get token(): any {
    return JSON.parse(localStorage.getItem('token') ?? 'null');
  }

  public set user(value: any) {
    localStorage.setItem('user', JSON.stringify(value));
  }

  public set token(value: any) {
    localStorage.setItem('token', JSON.stringify(value));
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.router.navigate(['/login']).then();
  }

  logoutReload() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    location.reload();
  }
}
