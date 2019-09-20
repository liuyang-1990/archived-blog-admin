import React from 'react';
import Redirect from 'umi/redirect';
import pathToRegexp from 'path-to-regexp';
import Authorized from '@/utils/Authorized';
import { MenuDataItem } from '@ant-design/pro-layout';
import { userStorage } from '@/utils/user.storage';

export interface Route extends MenuDataItem {
  routes?: Route[];
}

const getRouteAuthority = (path: string, routeData: Route[]) => {
  let authorities: string[] | string | undefined;
  routeData.forEach(route => {
    // match prefix
    if (pathToRegexp(`${route.path}(.*)`).test(path)) {
      // exact match
      if (route.path === path) {
        authorities = route.authority || authorities;
      }
      // get children authority recursively
      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

class AuthComponent extends React.Component<any, any>{
  render() {
    const { routes = [] } = this.props.route;
    return (
      <Authorized
        authority={getRouteAuthority(this.props.location.pathname, routes) || ''}
        noMatch={userStorage.IsLogin ? <Redirect to="/exception/403" /> : <Redirect to="/login" />}
      >
        {this.props.children}
      </Authorized>)
  }
}

export default AuthComponent;
