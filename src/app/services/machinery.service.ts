import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginateRequestModel } from '../models/paginate-request.model';
import { PaginateResponseModel } from '../models/paginate-response.model';
import MachineryModel from '../models/machinery.model';
import { environment } from '../../environments/environment';
import getPaginateParams from '../shared/utils/get-paginate-params';

@Injectable({
  providedIn: 'root'
})
export class MachineryService {
  baseUrl = environment.baseUrl + 'machinery/';

  constructor(private client: HttpClient) { }

  public get(paginate: PaginateRequestModel){
    const params = getPaginateParams(paginate);

    return this.client.get<PaginateResponseModel<MachineryModel>>(`${this.baseUrl}`, {params: params});
  }

  public getAll() {
    return this.client.get<MachineryModel[]>(this.baseUrl + 'all');
  }

  public create(machinery: MachineryModel) {
    return this.client.post<MachineryModel>(`${this.baseUrl}`, machinery);
  }

  public update(id: string, machinery: MachineryModel) {
    return this.client.put<MachineryModel>(`${this.baseUrl}${id}`, machinery);
  }

  public delete(id: string) {
    return this.client.delete(`${this.baseUrl}${id}`);
  }
}
