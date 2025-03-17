import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginateRequestModel } from '../models/paginate-request.model';
import { PaginateResponseModel } from '../models/paginate-response.model';
import { ExplorationModel } from '../models/exploration.model';


@Injectable({
  providedIn: 'root'
})
export class ExplorationsService {

  baseUrl = environment.baseUrl + 'explorations/';

  constructor(private client: HttpClient) { }

  public get(paginate: PaginateRequestModel) {
    const params = new HttpParams()
      .set('page', paginate.page)
      .set('pageSize', paginate.pageSize);

    return this.client.get<PaginateResponseModel<ExplorationModel>>(`${this.baseUrl}`, {params: params});
  }

  public getAll() {
    return this.client.get<ExplorationModel[]>(`${this.baseUrl}all`);
  }

  public create(exploration: ExplorationModel) {
    return this.client.post<ExplorationModel>(`${this.baseUrl}`, exploration);
  }

  public update(id: string, exploration: ExplorationModel) {
    return this.client.put<ExplorationModel>(`${this.baseUrl}${id}`, exploration);
  }

  public delete(id: string) {
    return this.client.delete<void>(`${this.baseUrl}${id}`);
  }
}
