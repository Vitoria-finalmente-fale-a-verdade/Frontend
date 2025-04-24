export interface PaginateRequestModel {
  page: number;
  pageSize: number;
  orderBy?: string;
  descending?: boolean;
}
