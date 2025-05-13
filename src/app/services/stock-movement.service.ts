import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { StockMovementModel } from '../models/stock-movement.model';
import {BaseService} from './base.service';

@Injectable({
  providedIn: 'root'
})
export class StockMovementService extends BaseService<StockMovementModel> {

  constructor(client: HttpClient) {
    super(client, environment.baseUrl + 'stockMovements/');
  }

  public getMovementTypes(){
    return this.client.get<any>(`${this.baseUrl}types`);
  }
}
