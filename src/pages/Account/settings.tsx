import React, { Component } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { Menu } from 'antd';
import BaseView from '@/components/Account/base';
import styles from './style.less';

const { Item } = Menu;


type PAGE_NAME_UPPER_CAMEL_CASEStateKeys = 'base' | 'security' | 'binding' | 'notification';
interface PAGE_NAME_UPPER_CAMEL_CASEState {
    mode: 'inline' | 'horizontal';
    menuMap: {
        [key: string]: React.ReactNode;
    };
    selectKey: PAGE_NAME_UPPER_CAMEL_CASEStateKeys;
}


class PAGE_NAME_UPPER_CAMEL_CASE extends Component<
    any,
    PAGE_NAME_UPPER_CAMEL_CASEState
    > {
    main: HTMLDivElement | undefined = undefined;

    constructor(props) {
        super(props);
        const menuMap = {
            base: '基本设置',
            security: '安全设置',
            binding: '账号绑定',
            notification: '新消息通知',
        };
        this.state = {
            mode: 'inline',
            menuMap,
            selectKey: 'base',
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.resize);
        this.resize();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

    getMenu = () => {
        const { menuMap } = this.state;
        return Object.keys(menuMap).map(item => <Item key={item}>{menuMap[item]}</Item>);
    };

    getRightTitle = () => {
        const { selectKey, menuMap } = this.state;
        return menuMap[selectKey];
    };

    selectKey = (key: PAGE_NAME_UPPER_CAMEL_CASEStateKeys) => {
        this.setState({
            selectKey: key,
        });
    };

    resize = () => {
        if (!this.main) {
            return;
        }
        requestAnimationFrame(() => {
            if (!this.main) {
                return;
            }
            let mode: 'inline' | 'horizontal' = 'inline';
            const { offsetWidth } = this.main;
            if (this.main.offsetWidth < 641 && offsetWidth > 400) {
                mode = 'horizontal';
            }
            if (window.innerWidth < 768 && offsetWidth > 400) {
                mode = 'horizontal';
            }
            this.setState({
                mode,
            });
        });
    };

    renderChildren = () => {
        const { selectKey } = this.state;
        switch (selectKey) {
            case 'base':
                return <BaseView />;
                // case 'security':
                //     return <SecurityView />;
                // case 'binding':
                //     return <BindingView />;
                // case 'notification':
                //     return <NotificationView />;
                // default:
                break;
        }

        return null;
    };

    render() {
        // const { currentUser } = this.props;
        // if (!currentUser.userid) {
        //     return '';
        // }
        const { mode, selectKey } = this.state;
        return (
            <GridContent>
                <div
                    className={styles.main}
                    ref={ref => {
                        if (ref) {
                            this.main = ref;
                        }
                    }}
                >
                    <div className={styles.leftMenu}>
                        <Menu
                            mode={mode}
                            selectedKeys={[selectKey]}
                            onClick={({ key }) => this.selectKey(key as PAGE_NAME_UPPER_CAMEL_CASEStateKeys)}
                        >
                            {this.getMenu()}
                        </Menu>
                    </div>
                    <div className={styles.right}>
                        <div className={styles.title}>{this.getRightTitle()}</div>
                        {this.renderChildren()}
                    </div>
                </div>
            </GridContent>
        );
    }
}

export default PAGE_NAME_UPPER_CAMEL_CASE;