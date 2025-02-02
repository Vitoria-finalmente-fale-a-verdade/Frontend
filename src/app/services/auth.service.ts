import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private router: Router,
  ) {
  }

  public get user(): any {
    return localStorage.getItem('user');
  }

  public get token(): any {
    return localStorage.getItem('token');
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

  login(username: string, password: string): any {
    if (username === 'admin' && password === 'admin') {
      const token = '123456789';
      const userData = {
        id: '987654321',
        username: 'pedro.soares',
        firstName: 'Pedro',
        lastName: 'Soares',
      };

      this.token = token;
      this.user = userData;

      return {
        token: this.token,
        user: this.user
      };
    } else {
      return false;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.router.navigate(['/login']);
  }
}
