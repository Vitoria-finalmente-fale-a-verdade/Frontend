import { HttpClient } from '@angular/common/http';
import {PaginateRequestModel} from '../models/paginate-request.model';
import getPaginateParams from '../shared/utils/get-paginate-params';
import {PaginateResponseModel} from '../models/paginate-response.model';
import setFilters from '../shared/utils/set-filters';

export class BaseService<Model> {
  constructor(
    protected client: HttpClient,
    protected baseUrl: string
  ) {}

  public get(paginate: PaginateRequestModel) {
    const params = getPaginateParams(paginate);
    return this.client.get<PaginateResponseModel<Model>>(this.baseUrl, { params });
  }

  public search(paginate: PaginateRequestModel, searchFields: Model) {
    const params = getPaginateParams(paginate);
    const filters = setFilters(searchFields);
    return this.client.post<PaginateResponseModel<Model>>(this.baseUrl + 'search', filters, { params: params });
  }

  public getAll() {
    return this.client.get<Model[]>(`${this.baseUrl}all/`);
  }

  public searchAll(searchFields: any) {
    const filters = setFilters(searchFields);
    return this.client.post<Model[]>(`${this.baseUrl}all/search/`, filters);
  }

  public create(model: Model) {
    return this.client.post<Model>(this.baseUrl, model);
  }

  public update(id: string, model: Model) {
    return this.client.put<Model>(`${this.baseUrl}${id}`, model);
  }

  public delete(id: string) {
    return this.client.delete<void>(`${this.baseUrl}${id}`);
  }
}
