import { ITableListItem, ITableListParams } from "./TableList";

export interface ITagTableListItem extends ITableListItem {
    TagName: string;
    Description: string;
    CreateTime: string;
}

export interface ITagTableListParams extends ITableListParams {
    tagName: string;
}
