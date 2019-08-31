import { ITableListItem, ITableListParams } from "./TableList";

export interface ICategoryTableListItem extends ITableListItem {
    CategoryName: string;
    Description: string;
    CreateTime: string;
}

export interface ICategoryTableListParams extends ITableListParams {
    categoryName: string;
}

