import {PaginateRequestModel} from '../../models/paginate-request.model';

export default function getDefaultPaginateRequest(): PaginateRequestModel {
  return {
    page: 0,
    pageSize: 10,
  };
}
