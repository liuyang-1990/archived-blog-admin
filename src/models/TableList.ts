export interface TableListItem {
  Id?: number,
  UserName?: string,
  Role?: string,
  Status?: string,
  Avatar?: string,
  CreateTime?: string,
}


export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  SortField?: string;
  SortOrder?: string;
  UserName?: string;
  Status?: number;
  PageNum: number;
  PageSize: number;
}
