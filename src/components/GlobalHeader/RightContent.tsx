import { Icon, Tooltip } from 'antd';
import React from 'react';
import Avatar from './AvatarDropdown';
import styles from './index.less';

class GlobalHeaderRight extends React.Component<any, any>{

  render() {
    let className = styles.right;

    return (
      <div className={className}>
        <Tooltip
          title={"使用文档"}>
          <a
            target="_blank"
            href="https://pro.ant.design/docs/getting-started"
            rel="noopener noreferrer"
            className={styles.action}>
            <Icon type="question-circle-o" />
          </a>
        </Tooltip>
        <Avatar />
      </div >
    )

  }
}

export default GlobalHeaderRight;
