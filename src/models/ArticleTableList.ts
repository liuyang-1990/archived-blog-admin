import { ITableListItem, ITableListParams } from "./TableList";

export interface IArticleTableListItem extends ITableListItem {
    Title: string;
    IsOriginal: number;
    Status: number;
    Abstract: string;
    ImageUrl: string;
    Content: string;
    CreateTime: string;
}

export interface IArticleTableListParams extends ITableListParams {
    StartTime: string;
    EndTime: string;
}

export interface IArticleDetail {
    ArticleInfo: IArticleTableListItem;
    Tags: Array<IProperty>;
    Categories: Array<IProperty>;
}


export interface IProperty {
    Key: number;
    Value: string;
}
