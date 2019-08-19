import request from "@/utils/request";

export async function login(params) {
  return request('account/login', {
    method: 'POST',
    data: params
  });
}