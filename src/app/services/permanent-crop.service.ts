import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {PaginateRequestModel} from '../models/paginate-request.model';
import {PaginateResponseModel} from '../models/paginate-response.model';
import {PropertyModel} from '../models/property.model';
import PermanentCropModel from '../models/permanent-crop.model';

@Injectable({
  providedIn: 'root'
})
export class PermanentCropService {
  baseUrl = environment.baseUrl + 'permanent-crop/';

  constructor(private client: HttpClient) { }

  public get(paginate: PaginateRequestModel){
    const params = new HttpParams()
      .set('page', paginate.page)
      .set('pageSize', paginate.pageSize);

    return this.client.get<PaginateResponseModel<PermanentCropModel>>(`${this.baseUrl}`, {params: params});
  }

  public getAll() {
    return this.client.get<PermanentCropModel[]>(this.baseUrl + 'all');
  }

  public create(permanentCrop: PermanentCropModel) {
    return this.client.post<PermanentCropModel>(`${this.baseUrl}`, permanentCrop);
  }

  public update(id: string, permanentCrop: PermanentCropModel) {
    return this.client.put<PropertyModel>(`${this.baseUrl}${id}`, permanentCrop);
  }

  public delete(id: string) {
    return this.client.delete(`${this.baseUrl}${id}`);
  }
}
