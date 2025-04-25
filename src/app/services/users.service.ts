import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {PaginateRequestModel} from '../models/paginate-request.model';
import {PaginateResponseModel} from '../models/paginate-response.model';
import {UserModel} from '../models/user.model';
import getPaginateParams from '../shared/utils/get-paginate-params';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  baseUrl = environment.baseUrl + 'users/';

  constructor(private client: HttpClient) { }

  public get(paginate: PaginateRequestModel) {
    const params = getPaginateParams(paginate);

    return this.client.get<PaginateResponseModel<UserModel>>(`${this.baseUrl}`, {params: params});
  }

  public find(name: string, role?: string) {
    const params = new HttpParams()
      .set('name', name);
    role && params.set('role', role);

    return this.client.get<UserModel[]>(`${this.baseUrl}find/`, {params: params});
  }

  public create(user: UserModel) {
    return this.client.post<UserModel>(`${this.baseUrl}`, user);
  }

  public update(id: string, user: UserModel) {
    return this.client.put<UserModel>(`${this.baseUrl}${id}`, user);
  }

  public delete(id: string) {
    return this.client.delete<void>(`${this.baseUrl}${id}`);
  }
}
