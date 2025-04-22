import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {PaginateRequestModel} from '../models/paginate-request.model';
import {PaginateResponseModel} from '../models/paginate-response.model';
import {ActivityModel} from '../models/activity.model';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  baseUrl = environment.baseUrl + 'activities/';

  constructor(private client: HttpClient) { }

  public get(paginate: PaginateRequestModel) {
    const params = new HttpParams()
      .set('page', paginate.page)
      .set('pageSize', paginate.pageSize);

    return this.client.get<PaginateResponseModel<ActivityModel>>(`${this.baseUrl}`, {params: params});
  }

  public getAll() {
    return this.client.get<ActivityModel[]>(`${this.baseUrl}all/`);
  }

  public create(user: ActivityModel) {
    return this.client.post<ActivityModel>(`${this.baseUrl}`, user);
  }

  public update(id: string, user: ActivityModel) {
    return this.client.put<ActivityModel>(`${this.baseUrl}${id}`, user);
  }

  public delete(id: string) {
    return this.client.delete<void>(`${this.baseUrl}${id}`);
  }
}
