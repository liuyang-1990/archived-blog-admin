import { decodeJwt } from "./utils";

export interface IJwtModel {
    Uid: number,
    Role: string,
    UserName: string,
    Avtar: string
}

class UserStorage {

    get AccessToken() {
        return localStorage.getItem('x-access-token') ? localStorage.getItem('x-access-token')
            : sessionStorage.getItem('x-access-token');
    }

    get RefreshToken() {
        return localStorage.getItem('x-refresh-token') ? localStorage.getItem('x-refresh-token')
            : sessionStorage.getItem('x-refresh-token');
    }

    get CurrentUser(): IJwtModel {
        const token = this.AccessToken;
        const jwt = decodeJwt(token);
        return JSON.parse(jwt["http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata"])
    }

    get Authority() {
        return this.CurrentUser.Role;
    }

    get IsLogin() {
        return !!this.AccessToken;
    }

}

export default new UserStorage()