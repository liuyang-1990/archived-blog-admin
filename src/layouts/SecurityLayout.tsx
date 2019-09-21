import React from 'react';
import { Redirect } from 'umi';
import { stringify } from 'querystring';
import PageLoading from '@/components/PageLoading';
import { userStorage } from '@/utils/user.storage';


interface ISecurityLayoutState {
    isReady: boolean;
}

class SecurityLayout extends React.Component<any, ISecurityLayoutState> {
    constructor(props){
        super(props);
        this.state={
            isReady: false
        }
    }

    componentDidMount() {
        this.setState({
            isReady: true,
        });
    }

    render() {
        const { isReady } = this.state;
        const { children } = this.props;
        const isLogin = userStorage.IsLogin;
        const queryString = stringify({
            redirect: window.location.href,
        });
        if (!isReady) {
            return <PageLoading />;
        }
        if (!isLogin) {
            return <Redirect to={`/login?${queryString}`}></Redirect>;
        }
        return children;
    }
}

export default SecurityLayout;