import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginateRequestModel } from '../models/paginate-request.model';
import getPaginateParams from '../shared/utils/get-paginate-params';
import { PaginateResponseModel } from '../models/paginate-response.model';
import { StockMovementModel } from '../models/stock-movement.model';

@Injectable({
  providedIn: 'root'
})
export class StockMovementService {

  baseUrl = environment.baseUrl + 'inventory/items/f11a11a1-feed-4eec-abee-abc123def001/movements/';

  constructor(private client: HttpClient) { }

  public get(paginate: PaginateRequestModel) {
    const params = getPaginateParams(paginate);

    return this.client.get<PaginateResponseModel<StockMovementModel>>(`${this.baseUrl}`, {params: params});
  }

  public getAll() {
    return this.client.get<StockMovementModel[]>(`${this.baseUrl}all/`);
  }

  public create(user: StockMovementModel) {
    return this.client.post<StockMovementModel>(`${this.baseUrl}`, user);
  }

  public update(id: string, user: StockMovementModel) {
    return this.client.put<StockMovementModel>(`${this.baseUrl}${id}`, user);
  }

  public delete(id: string) {
    return this.client.delete<void>(`${this.baseUrl}${id}`);
  }
}