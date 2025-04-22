import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {PaginateRequestModel} from '../models/paginate-request.model';
import {PaginateResponseModel} from '../models/paginate-response.model';
import {PropertyModel} from '../models/property.model';
import CropModel from '../models/crop.model';

@Injectable({
  providedIn: 'root'
})
export class CropService {
  baseUrl = environment.baseUrl + 'crop/';

  constructor(private client: HttpClient) { }

  public get(paginate: PaginateRequestModel){
    const params = new HttpParams()
      .set('page', paginate.page)
      .set('pageSize', paginate.pageSize);

    return this.client.get<PaginateResponseModel<CropModel>>(`${this.baseUrl}`, {params: params});
  }

  public getAll() {
    return this.client.get<CropModel[]>(this.baseUrl + 'all');
  }

  public create(crop: CropModel) {
    return this.client.post<CropModel>(`${this.baseUrl}`, crop);
  }

  public update(id: string, crop: CropModel) {
    return this.client.put<PropertyModel>(`${this.baseUrl}${id}`, crop);
  }

  public delete(id: string) {
    return this.client.delete(`${this.baseUrl}${id}`);
  }
}
