import request from "@/utils/request";

export async function queryByPage(params): Promise<any> {
    return request('user/page', {
        params: params
    });
}


export async function addUser(params): Promise<any> {
    return request('user', {
        method: 'POST',
        data: params
    });
}

export async function updateUser(params): Promise<any> {
    return request('user', {
        method: 'PUT',
        data: params
    });
}


export async function deleteUser(id): Promise<any> {
    return request(`user/${id}`, {
        method: 'DELETE'
    });
}


export async function UpdateStatus(params): Promise<any> {
    return request('user/status', {
        method: 'POST',
        data: params
    });
}