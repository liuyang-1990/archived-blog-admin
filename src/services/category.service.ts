import request from "@/utils/request";
import { IResultModel, IJsonResultModel } from "@/models/TableList";
import { ICategoryTableListItem, ICategoryTableListParams } from "@/models/CategoryTableList";


export async function queryByPage(params?: Partial<ICategoryTableListParams>): Promise<IJsonResultModel<ICategoryTableListItem>> {
    return request('category/page', {
        params: params
    });
}


export async function addCategory(params): Promise<IResultModel<string>> {
    return request('category', {
        method: 'POST',
        data: params
    });
}


export async function updateCategory(params): Promise<IResultModel<string>> {
    return request('category', {
        method: 'PUT',
        data: params
    });
}

export async function deleteCategory(id: number): Promise<IResultModel<string>> {
    return request(`category/${id}`, {
        method: 'DELETE'
    });
}

