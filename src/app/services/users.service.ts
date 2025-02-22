import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {delay, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  baseUrl = environment.baseUrl + 'users/';

  constructor(private client: HttpClient) { }

  public find(name: string, role?: string): Observable<any> {
    const params = new HttpParams()
      .set('name', name);
    role && params.set('role', role);

    return this.client.get(`${this.baseUrl}find/`, {params: params}).pipe(
      delay(0),
    );
  }
}
