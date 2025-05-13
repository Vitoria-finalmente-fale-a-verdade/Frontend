import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {UserModel} from '../models/user.model';
import {BaseService} from './base.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends BaseService<UserModel> {

  constructor(client: HttpClient) {
    super(client, environment.baseUrl + 'users/');
  }

  public find(name: string, role?: string) {
    const params = new HttpParams()
      .set('name', name);
    role && params.set('role', role);

    return this.client.get<UserModel[]>(`${this.baseUrl}find/`, {params: params});
  }
}
