import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {PaginateRequestModel} from '../models/paginate-request.model';
import {PaginateResponseModel} from '../models/paginate-response.model';
import getPaginateParams from '../shared/utils/get-paginate-params';
import {ActivityModel} from '../models/activity.model';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  baseUrl = environment.baseUrl + 'activities/';

  constructor(private client: HttpClient) { }

  public get(paginate: PaginateRequestModel) {
    const params = getPaginateParams(paginate);

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
