import {Injectable} from '@angular/core';
import MachineryModel from '../models/machinery.model';
import { environment } from '../../environments/environment';
import {BaseService} from './base.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MachineryService extends BaseService<MachineryModel> {

  constructor(client: HttpClient) {
    super(client, environment.baseUrl + 'machinery/');
  }
}
