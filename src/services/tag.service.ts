import request from "@/utils/request";

export async function queryByPage(params): Promise<any> {
    return request('tag/page', {
        params: params
    });
}


export async function addTag(params): Promise<any> {
    return request('tag', {
        method: 'POST',
        data: params
    });
}


export async function updateTag(params): Promise<any> {
    return request('tag', {
        method: 'PUT',
        data: params
    });
}

export async function deleteTag(id: number): Promise<any> {
    return request(`tag/${id}`, {
        method: 'DELETE'
    });
}

