class PagedResult<T> {
  list: T[];
  totalResults: number;
  pageIndex: number;
  pageSize: number;
  query?: string;

  constructor(
    list: T[] = [],
    totalResults = 0,
    pageIndex = 1,
    pageSize = 10,
    query?: string
  ) {
    this.totalResults = totalResults;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.query = query;
    this.list = list;
  }
}

export default PagedResult;
