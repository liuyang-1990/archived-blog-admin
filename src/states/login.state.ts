import { observable, action } from 'mobx';
import { login } from '@/services/login.service';
import { injectable } from 'inversify';
import { getPageQuery } from '@/utils/utils';
import router from 'umi/router';
import { userStorage } from '@/utils/user.storage';


export interface StateType {
    status?: 'ok' | 'error';
    type?: string;
    message?: string;
    currentAuthority?: 'user' | 'guest' | 'admin';
}



@injectable()
export default class LoginState {

    @observable submitting: boolean = false;
    @observable stateType: StateType = {};
    @action.bound
    async handleSubmit(params) {
        this.submitting = true;
        const response = await login(params);
        this.submitting = false;
        switch (response && response.Status) {
            case "0":
                userStorage.AccessToken = response.ResultInfo.AccessToken;
                userStorage.RefreshToken = response.ResultInfo.RefreshToken;
                const urlParams = new URL(window.location.href);
                const params = getPageQuery();
                let { redirect } = params as { redirect: string };
                if (redirect) {
                    const redirectUrlParams = new URL(redirect);
                    if (redirectUrlParams.origin === urlParams.origin) {
                        redirect = redirect.substr(urlParams.origin.length);
                        if (redirect.match(/^\/.*#/)) {
                            redirect = redirect.substr(redirect.indexOf('#') + 1);
                        }
                    } else {
                        window.location.href = redirect;
                    }
                }
                router.push(redirect || "/");
                break;
            case "1":
                this.stateType = {
                    status: 'error',
                    message: '用户名或者密码错误!'
                };
                break;
            case "2":
                this.stateType = {
                    status: 'error',
                    message: '用户被禁用!请联系管理员!'
                };
                break;
        }
    }
}
