import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {PropertyModel} from '../models/property.model';
import {PaginateResponseModel} from '../models/paginate-response.model';
import {PaginateRequestModel} from '../models/paginate-request.model';
import {Subject, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {
  baseUrl = environment.baseUrl + 'properties/';
  changeProperties = new Subject<void>();

  constructor(private client: HttpClient) { }

  public get(paginate: PaginateRequestModel){
    const params = new HttpParams()
      .set('page', paginate.page)
      .set('pageSize', paginate.pageSize);

    return this.client.get<PaginateResponseModel<PropertyModel>>(`${this.baseUrl}`, {params: params});
  }

  public getAll() {
    return this.client.get<PropertyModel[]>(this.baseUrl + 'all');
  }

  public create(property: PropertyModel) {
    return this.client.post<PropertyModel>(`${this.baseUrl}`, property).pipe(
      tap({
        next: _ => {
          this.changeProperties.next();
        }
      })
    );
  }

  public update(id: string, property: PropertyModel) {
    return this.client.put<PropertyModel>(`${this.baseUrl}${id}`, property).pipe(
      tap({
        next: _ => {
          this.changeProperties.next();
        }
      })
    );
  }

  public delete(id: string) {
    return this.client.delete(`${this.baseUrl}${id}`).pipe(
      tap({
        next: _ => {
          this.changeProperties.next();
        }
      })
    );
  }
}
