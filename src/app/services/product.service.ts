import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { PaginateRequestModel } from '../models/paginate-request.model';
import getPaginateParams from '../shared/utils/get-paginate-params';
import { PaginateResponseModel } from '../models/paginate-response.model';
import { ProductModel } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  baseUrl = environment.baseUrl + 'products/';

  constructor(private client: HttpClient) { }

  public get(paginate: PaginateRequestModel) {
    const params = getPaginateParams(paginate);

    return this.client.get<PaginateResponseModel<ProductModel>>(`${this.baseUrl}`, {params: params});
  }

  public getAll() {
    return this.client.get<ProductModel[]>(`${this.baseUrl}all/`);
  }

  public create(user: ProductModel) {
    return this.client.post<ProductModel>(`${this.baseUrl}`, user);
  }

  public update(id: string, user: ProductModel) {
    return this.client.put<ProductModel>(`${this.baseUrl}${id}`, user);
  }

  public delete(id: string) {
    return this.client.delete<void>(`${this.baseUrl}${id}`);
  }
}