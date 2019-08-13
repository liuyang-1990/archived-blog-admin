import { Alert, Checkbox, Icon } from 'antd';
import React, { Component } from 'react';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { FormComponentProps } from 'antd/es/form';
import Link from 'umi/link';
import { observer } from 'mobx-react';
import LoginComponents from '../components/Login';
import { container } from '@/utils/ioc';
import LoginState from '@/stores/login.state';
import styles from './style.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginComponents;

// interface LoginState {
//     type: string;
//     autoLogin: boolean;
// }
export interface FormDataType {
    userName: string;
    password: string;
    mobile: string;
    captcha: string;
}
@observer
class Login extends Component<any, any> {
    loginForm: FormComponentProps['form'] | undefined | null = undefined;
    private store: LoginState = container.get("LoginState");
    // state: LoginState = {
    //     type: 'account',
    //     autoLogin: true,
    // };
    constructor(props) {
        super(props);
        this.state = {
            type: 'account',
            activeFields: ['UserName', 'Password'],
            autoLogin: true
        };
    }
    changeAutoLogin = (e: CheckboxChangeEvent) => {
        this.setState({
            autoLogin: e.target.checked,
        });
    };

    handleSubmit = (err: any, values: FormDataType) => {
        this.store.handleSubmit();

    };

    onTabChange = (type: string) => {
        this.setState({ type });
    };

    onGetCaptcha = () =>
        new Promise((resolve, reject) => {
            if (!this.loginForm) {
                return;
            }
            this.loginForm.validateFields(['mobile'], {}, (err: any, values: FormDataType) => {
                if (err) {
                    reject(err);
                } else {
                    const { dispatch } = this.props;
                    ((dispatch({
                        type: 'userLogin/getCaptcha',
                        payload: values.mobile,
                    }) as unknown) as Promise<any>)
                        .then(resolve)
                        .catch(reject);
                }
            });
        });

    renderMessage = (content: string) => (
        <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
    );

    render() {
        // const { userLogin, submitting } = this.props;
        //  const { status, type: loginType } = userLogin;
        const { type, autoLogin } = this.state;
        return (
            <div className={styles.main}>
                <LoginComponents
                    defaultActiveKey={type}
                    onTabChange={this.onTabChange}
                    onSubmit={this.handleSubmit}
                    ref={(form: any) => {
                        this.loginForm = form;
                    }}
                >
                    <Tab key="account" tab={"账号密码登录"}>
                        {/* {status === 'error' &&
                            loginType === 'account' &&
                            !submitting &&
                            this.renderMessage(
                                formatMessage({ id: 'user-login.login.message-invalid-credentials' }),
                            )} */}
                        <UserName
                            name="userName"
                            placeholder={"用户名"}
                            rules={[
                                {
                                    required: true,
                                    message: "请输入用户名!",
                                },
                            ]}
                        />
                        <Password
                            name="password"
                            placeholder={"密码"}
                            rules={[
                                {
                                    required: true,
                                    message: "请输入密码!",
                                },
                            ]}
                            onPressEnter={e => {
                                e.preventDefault();
                                this.loginForm && this.loginForm.validateFields(this.handleSubmit);
                            }}
                        />
                    </Tab>
                    <Tab key="mobile" tab={"手机号登录"}>
                        {/* {status === 'error' &&
                            loginType === 'mobile' &&
                            !submitting &&
                            this.renderMessage(
                                formatMessage({ id: 'user-login.login.message-invalid-verification-code' }),
                            )} */}
                        <Mobile
                            name="mobile"
                            placeholder={'手机号'}
                            rules={[
                                {
                                    required: true,
                                    message: "请输入手机号！",
                                },
                                {
                                    pattern: /^1\d{10}$/,
                                    message: "手机号格式错误！",
                                },
                            ]}
                        />
                        <Captcha
                            name="captcha"
                            placeholder={'验证码'}
                            countDown={120}
                            onGetCaptcha={this.onGetCaptcha}
                            getCaptchaButtonText={"验证码"}
                            //getCaptchaSecondText={formatMessage({ id: 'user-login.captcha.second' })}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入验证码',
                                },
                            ]}
                        />
                    </Tab>
                    <div>
                        <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
                            自动登录
                        </Checkbox>
                        <a style={{ float: 'right' }} href="">
                            忘记密码
                        </a>
                    </div>
                    <Submit >
                        登录
                    </Submit>
                    <div className={styles.other}>
                        其他登录方式
                        <Icon type="alipay-circle" className={styles.icon} theme="outlined" />
                        <Icon type="taobao-circle" className={styles.icon} theme="outlined" />
                        <Icon type="weibo-circle" className={styles.icon} theme="outlined" />
                        {/* <Link className={styles.register} to="/user/register">
                            <FormattedMessage id="user-login.login.signup" />
                        </Link> */}
                    </div>
                </LoginComponents>
            </div>
        );
    }
}

export default Login;
