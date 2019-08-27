import { ITableListItem, ITableListParams } from "./TableList";

export interface IUserTableListItem extends ITableListItem {
    UserName: string,
    Role: number,
    Status: number,
    Avatar: string,
    CreateTime: string,
}

export interface IUserTableListParams extends ITableListParams {
    UserName?: string;
    Status?: number;
}

