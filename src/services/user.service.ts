import request from "@/utils/request";
import { IUserTableListParams, IUserTableListItem } from "@/models/UserTableList";
import { IJsonResultModel, IResultModel } from "@/models/TableList";

export async function queryByPage(params?: Partial<IUserTableListParams>): Promise<IJsonResultModel<IUserTableListItem>> {
    return request('user/page', {
        params: params
    });
}


export async function addUser(params): Promise<IResultModel<string>> {
    return request('user', {
        method: 'POST',
        data: params
    });
}

export async function updateUser(params): Promise<IResultModel<string>> {
    return request('user', {
        method: 'PUT',
        data: params
    });
}


export async function deleteUser(id: number): Promise<IResultModel<string>> {
    return request(`user/${id}`, {
        method: 'DELETE'
    });
}


export async function UpdateStatus(params): Promise<IResultModel<string>> {
    return request('user/status', {
        method: 'POST',
        data: params
    });
}