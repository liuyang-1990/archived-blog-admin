import { decodeJwt } from "./utils";

export interface IJwtModel {
    Uid: number,
    Role: string,
    UserName: string,
    Avatar: string
}

class UserStorage {

    private _autoLogin!: boolean;
    private _accessToken!: string | null;
    private _refreshToken!: string | null;

    get AutoLogin(): boolean {
        return this._autoLogin;
    }

    set AutoLogin(autoLogin: boolean) {
        this._autoLogin = autoLogin;
    }


    set AccessToken(token: string | null) {
        this._accessToken = token;
        if (token) {
            if (this._autoLogin) {
                localStorage.setItem('x-access-token', token);
            } else {
                sessionStorage.setItem('x-access-token', token);
            }
        }
    }

    get AccessToken(): string | null {
        if (this._autoLogin) {
            return localStorage.getItem('x-access-token');
        }
        return sessionStorage.getItem('x-access-token');
    }

    set RefreshToken(token: string | null) {
        this._refreshToken = token;
        if (token) {
            if (this._autoLogin) {
                localStorage.setItem('x-refresh-token', token);
            } else {
                sessionStorage.setItem('x-refresh-token', token);
            }
        }
    }

    get RefreshToken(): string | null {
        if (this._autoLogin) {
            return localStorage.getItem('x-refresh-token');
        }
        return sessionStorage.getItem('x-refresh-token');
    }

    get CurrentUser(): IJwtModel | null {
        const token = this._accessToken;
        try {
            const jwt = decodeJwt(token);
            return JSON.parse(jwt["http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata"])
        } catch (err) {
            return null;
        }
    }

    get Authority() {
        return this.CurrentUser && this.CurrentUser.Role;
    }

    get IsLogin() {
        return !!this._accessToken;
    }
}

export const userStorage = new UserStorage();