import { observable, action } from 'mobx';
import { login } from '@/services/login.service';
import { injectable } from 'inversify';
import { getPageQuery } from '@/utils/utils';
import router from 'umi/router';


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
                localStorage.setItem("x-access-token", response.ResultInfo.AccessToken);
                localStorage.setItem("x-refresh-token", response.ResultInfo.RefreshToken);
                // const urlParams = new URL(window.location.href);
                //const params = getPageQuery();
                router.push("/");
                //window.location.href = redirectUrl;
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
