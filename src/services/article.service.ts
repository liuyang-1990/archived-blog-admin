import request from "@/utils/request";
import { ITagTableListItem } from "@/models/TagTableList";
import { IArticleTableListParams, IArticleTableListItem, IArticleDetail } from "@/models/ArticleTableList";
import { IJsonResultModel, IResultModel } from "@/models/TableList";
import { ICategoryTableListItem } from "@/models/CategoryTableList";


export async function getAllTags(): Promise<ITagTableListItem[]> {
    return request('tag/all');
}

export async function getAllCategories(): Promise<ICategoryTableListItem[]> {
    return request('category/all');
}

export async function postArticle(params: Partial<IArticleTableListItem>): Promise<IResultModel<string>> {
    return request("article", {
        method: 'POST',
        data: params
    });
}

export async function updateArticle(params: Partial<IArticleTableListItem>): Promise<IResultModel<string>> {
    return request("article", {
        method: 'PUT',
        data: params
    });
}


export async function queryByPage(params?: Partial<IArticleTableListParams>): Promise<IJsonResultModel<IArticleTableListItem>> {
    return request("article/page", {
        params: params
    });
}

export async function deleteArticle(id: number): Promise<IResultModel<string>> {
    return request(`article/${id}`, {
        method: 'DELETE'
    });
}


export async function getArticleDetail(id: number): Promise<IArticleDetail> {
    return request(`article/${id}`);
}