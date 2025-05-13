import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {RoleModel} from '../models/role.model';
import {BaseService} from './base.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RolesService extends BaseService<RoleModel> {

  constructor(client: HttpClient) {
    super(client, environment.baseUrl + 'roles/');
  }
}
