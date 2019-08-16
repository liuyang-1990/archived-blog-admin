import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
} from '@ant-design/pro-layout';
import React, { Fragment } from 'react';
import Link from 'umi/link';
import logo from '../assets/logo.svg';
import { BackTop, Icon } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import GlobalFooter from '@/components/GlobalFooter';

export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  settings: Settings;
}
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};


const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map(item => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : [],
    };
    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });

const links = [{
  key: 'Ant Design Pro',
  title: 'Ant Design Pro',
  href: 'https://pro.ant.design',
  blankTarget: true,
},
{
  key: 'github',
  title: <Icon type="github" />,
  href: 'https://github.com/liuyang-1990/blog-admin',
  blankTarget: true,
},
{
  key: 'Ant Design',
  title: 'Ant Design',
  href: 'https://ant.design',
  blankTarget: true,
}];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2019 created by liuyang
    </Fragment>
);


const footerRender: BasicLayoutProps['footerRender'] = (_, defaultDom) => {
  return <GlobalFooter links={links} copyright={copyright} />
};

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  const { children } = props;

  return (
    <ProLayout
      logo={logo}
      title="Blog Admin"
      fixSiderbar={true}
      fixedHeader={true}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl) {
          return defaultDom;
        }
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: "首页",
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
            <span>{route.breadcrumbName}</span>
          );
      }}
      footerRender={footerRender}
      rightContentRender={rightProps => <RightContent {...rightProps} />}
      menuDataRender={menuDataRender}
      {...props}
    >
      {children}
      <BackTop visibilityHeight={100} />
    </ProLayout>
  );
};

export default BasicLayout;
