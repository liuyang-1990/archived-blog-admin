import { observable, action } from 'mobx';
import { login } from '@/services/login.service';
import { injectable } from 'inversify';

@injectable()
export default class LoginState {
    @observable loading: boolean = false;

    @action.bound
    handleSubmit() {
        login();
    }
}