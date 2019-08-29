export interface ITableListItem {
  Id: number,
  key: string,
  isNew?: boolean;
  editable?: boolean;
  disabled?: boolean;
}

export interface ITableListPagination {
  total: number;
  pageSize: number;
  current: number;
}


export interface ITableListData<T extends ITableListItem> {
  list: T[];
  pagination: Partial<ITableListPagination>;
}

export interface ITableListParams {
  SortField?: string;
  SortOrder?: string;
  PageNum: number;
  PageSize: number;
}


export interface IJsonResultModel<T> {
  Rows: T[];
  TotalRows: number;
}

export interface IResultModel<T> {
  ResultInfo: T;
  IsSuccess: boolean;
  Status: string;
}