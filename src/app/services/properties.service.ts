import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {PropertyModel} from '../models/property.model';
import {PaginateResponseModel} from '../models/paginate-response.model';
import {PaginateRequestModel} from '../models/paginate-request.model';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {
  baseUrl = environment.baseUrl + 'properties/';

  constructor(private client: HttpClient) { }

  public get(paginate: PaginateRequestModel){
    const params = new HttpParams()
      .set('page', paginate.page)
      .set('pageSize', paginate.pageSize);

    return this.client.get<PaginateResponseModel<PropertyModel>>(`${this.baseUrl}`, {params: params});
  }

  public create(property: PropertyModel) {
    return this.client.post<PropertyModel>(`${this.baseUrl}`, property);
  }

  public update(id: string, property: PropertyModel) {
    return this.client.put<PropertyModel>(`${this.baseUrl}${id}`, property);
  }

  public delete(id: string) {
    return this.client.delete(`${this.baseUrl}${id}`);
  }
}
