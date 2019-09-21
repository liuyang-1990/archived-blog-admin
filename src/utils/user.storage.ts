import { decodeJwt } from "./utils";

export interface IJwtModel {
    Uid: number,
    Role: string,
    UserName: string,
    Avatar: string
}

class UserStorage {

    get AutoLogin(): boolean {
        return !!localStorage.getItem("autoLogin");
    }

    set AccessToken(token: string | null) {
        if (token) {
            if (this.AutoLogin) {
                localStorage.setItem('x-access-token', token);
            } else {
                sessionStorage.setItem('x-access-token', token);
            }
        }
    }

    get AccessToken(): string | null {
        if (this.AutoLogin) {
            return localStorage.getItem('x-access-token');
        }
        return sessionStorage.getItem('x-access-token');
    }

    set RefreshToken(token: string | null) {
        if (token) {
            if (this.AutoLogin) {
                localStorage.setItem('x-refresh-token', token);
            } else {
                sessionStorage.setItem('x-refresh-token', token);
            }
        }
    }

    get RefreshToken(): string | null {
        if (this.AutoLogin) {
            return localStorage.getItem('x-refresh-token');
        }
        return sessionStorage.getItem('x-refresh-token');
    }

    get CurrentUser(): IJwtModel | null {
        const token = this.AccessToken;
        try {
            const jwt = decodeJwt(token);
            return JSON.parse(jwt["http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata"])
        } catch (err) {
            return null;
        }
    }

    get Authority() {
        return this.CurrentUser && this.CurrentUser.Role.toLowerCase();
    }

    get IsLogin() {
        return !!this.AccessToken;
    }
}

export const userStorage = new UserStorage();