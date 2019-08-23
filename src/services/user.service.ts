import request from "@/utils/request";

export async function queryByPage(params) {
    return request('user/page', {
        data: params
    });
}