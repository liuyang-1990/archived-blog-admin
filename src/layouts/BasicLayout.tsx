import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
} from '@ant-design/pro-layout';
import React from 'react';
import Link from 'umi/link';
import logo from '../assets/logo.svg';
import { BackTop } from 'antd';

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
    return localItem as MenuDataItem;
  });

const footerRender: BasicLayoutProps['footerRender'] = (_, defaultDom) => {
  return defaultDom;
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
      menuDataRender={menuDataRender}
      {...props}
    >
      {children}
      <BackTop visibilityHeight={100} />
    </ProLayout>
  );
};

export default BasicLayout;