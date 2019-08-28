import request from "@/utils/request";
import { IResultModel, IJsonResultModel } from "@/models/TableList";
import { ITagTableListItem, IUserTableListParams } from "@/models/TagTableList";

export async function queryByPage(params?: Partial<IUserTableListParams>): Promise<IJsonResultModel<ITagTableListItem>> {
    return request('tag/page', {
        params: params
    });
}


export async function addTag(params): Promise<IResultModel<string>> {
    return request('tag', {
        method: 'POST',
        data: params
    });
}


export async function updateTag(params): Promise<IResultModel<string>> {
    return request('tag', {
        method: 'PUT',
        data: params
    });
}

export async function deleteTag(id: number): Promise<IResultModel<string>> {
    return request(`tag/${id}`, {
        method: 'DELETE'
    });
}

