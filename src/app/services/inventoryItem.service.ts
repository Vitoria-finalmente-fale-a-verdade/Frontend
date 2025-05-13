import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { InventoryItemModel } from '../models/inventory-item.model';
import {BaseService} from './base.service';
import EnumModel from '../models/enum.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryItemService extends BaseService<InventoryItemModel> {

  constructor(client: HttpClient) {
    super(client, environment.baseUrl + 'inventory/items/');
  }

  public getMovementTypes() {
    return this.client.get<EnumModel>(`${this.baseUrl}types`);
  }
}
