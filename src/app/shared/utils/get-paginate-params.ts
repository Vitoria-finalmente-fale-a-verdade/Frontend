import {PaginateRequestModel} from '../../models/paginate-request.model';
import {HttpParams} from '@angular/common/http';

export default function getPaginateParams(paginate: PaginateRequestModel) {
  return new HttpParams()
    .set('page', paginate.page)
    .set('pageSize', paginate.pageSize)
    .set('orderBy', paginate.orderBy ?? '')
    .set('descending', paginate.descending ?? false);
}
