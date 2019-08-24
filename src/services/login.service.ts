import request from "@/utils/request";

export async function login(params):Promise<any> {
  return request('account/login', {
    method: 'POST',
    data: params
  });
}