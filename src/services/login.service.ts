import request from "@/utils/request";


export async function login(): Promise<any> {
  return request.post('/account/login', {
    data: {
      "UserName": "admin",
      "Password": "12"
    }
  });
}