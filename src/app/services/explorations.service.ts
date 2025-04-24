import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {PaginateRequestModel} from '../models/paginate-request.model';
import {PaginateResponseModel} from '../models/paginate-response.model';
import {ExplorationModel} from '../models/exploration.model';
import getPaginateParams from '../shared/utils/get-paginate-params';

@Injectable({
  providedIn: 'root'
})
export class ExplorationsService {

  baseUrl = environment.baseUrl + 'explorations/';

  constructor(private client: HttpClient) { }

  public get(paginate: PaginateRequestModel) {
    const params = getPaginateParams(paginate);

    return this.client.get<PaginateResponseModel<ExplorationModel>>(`${this.baseUrl}`, {params: params});
  }

  public getAll() {
    return this.client.get<ExplorationModel[]>(`${this.baseUrl}all/`);
  }

  public create(user: ExplorationModel) {
    return this.client.post<ExplorationModel>(`${this.baseUrl}`, user);
  }

  public update(id: string, user: ExplorationModel) {
    return this.client.put<ExplorationModel>(`${this.baseUrl}${id}`, user);
  }

  public delete(id: string) {
    return this.client.delete<void>(`${this.baseUrl}${id}`);
  }
}
