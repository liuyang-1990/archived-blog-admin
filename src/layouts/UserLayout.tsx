import Link from 'umi/link';
import React from 'react';
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';
import FooterView from '@ant-design/pro-layout/lib/Footer';

class UserLayout extends React.Component<any, any> {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>Blog Admin</span>
              </Link>
            </div>
            <div className={styles.desc}>Ant Design 是西湖区最具影响力的 Web 设计规范</div>
          </div>
          {this.props.children}
        </div>
        <FooterView copyright="2019 created by liuyang" />
      </div>
    );

  }
}

export default UserLayout;
