import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { PaginateRequestModel } from '../models/paginate-request.model';
import getPaginateParams from '../shared/utils/get-paginate-params';
import { PaginateResponseModel } from '../models/paginate-response.model';
import { InventoryItemModel } from '../models/inventoryItem.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryItemService {

  baseUrl = environment.baseUrl + 'inventory/items/';

  constructor(private client: HttpClient) { }

  public get(paginate: PaginateRequestModel) {
    const params = getPaginateParams(paginate);

    return this.client.get<PaginateResponseModel<InventoryItemModel>>(`${this.baseUrl}`, {params: params});
  }

  public getAll() {
    return this.client.get<InventoryItemModel[]>(`${this.baseUrl}all/`);
  }

  public create(user: InventoryItemModel) {
    return this.client.post<InventoryItemModel>(`${this.baseUrl}`, user);
  }

  public update(id: string, user: InventoryItemModel) {
    return this.client.put<InventoryItemModel>(`${this.baseUrl}${id}`, user);
  }

  public delete(id: string) {
    return this.client.delete<void>(`${this.baseUrl}${id}`);
  }

  public getMovementTypes(){
    return this.client.get<any>(`inventory/movementTypes/`);
  }
}
