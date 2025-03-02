export interface PaginateResponseModel<T> {
  items: T[],
  page: number,
  pageSize: number,
  total: number,
}
