import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {RoleModel} from '../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  baseUrl = environment.baseUrl + 'roles/';

  constructor(private httpClient: HttpClient) { }

  public getAll() {
    return this.httpClient.get<RoleModel[]>(this.baseUrl + 'all');
  }
}
