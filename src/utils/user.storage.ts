import { decodeJwt } from "./utils";

export interface IJwtModel {
    Uid: number,
    Role: string,
    UserName: string,
    Avatar: string
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

    get CurrentUser(): IJwtModel | null {
        const token = this.AccessToken;
        try {
            const jwt = decodeJwt(token);
            return JSON.parse(jwt["http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata"])
        } catch (err) {
            //console.log(err);
            return null;
        }
    }

    get Authority() {
        return this.CurrentUser && this.CurrentUser.Role;
    }

    get IsLogin() {
        return !!this.AccessToken;
    }
}
export const userStorage = new UserStorage();
