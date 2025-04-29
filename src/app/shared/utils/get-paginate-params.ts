import {PaginateRequestModel} from '../../models/paginate-request.model';
import {HttpParams} from '@angular/common/http';

export default function getPaginateParams(paginate: PaginateRequestModel) {
  let params = new HttpParams()
    .set('page', paginate.page)
    .set('pageSize', paginate.pageSize)

  if (paginate.orderBy?.length) {
    params = params
      .set('orderBy', paginate.orderBy ?? '')
      .set('descending', paginate.descending ?? false);
  }

  return params;
}
