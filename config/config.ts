import { IConfig, IPlugin } from 'umi-types'; // https://umijs.org/config/

import slash from 'slash2';
import webpackPlugin from './plugin.config';
const plugins: IPlugin[] = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: false,
      locale: false,
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
    },
  ],
];
export default {
  plugins,
  block: {
    defaultGitUrl: 'https://github.com/ant-design/pro-blocks',
  },
  hash: true,
  targets: {
    ie: 11,
  },
  devtool: process.env.NODE_ENV === 'development' ? 'source-map' : false,
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/login',
      component: '../layouts/UserLayout',
      routes: [
        {
          path: '/login',
          component: './User/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/BasicLayout',
      Routes: ['src/pages/Authorized'],
      authority: ['admin', 'user'],
      routes: [
        {
          name: '标签页',
          icon: 'tag',
          path: '/tag',
          routes: [
            {
              path: '/tag/list',
              name: '标签列表',
              component: './Tag/TagInfo',
            },
          ]
        },
        {
          name: '系统管理',
          icon: 'setting',
          path: '/system',
          routes: [
            {
              path: '/system/user',
              name: '用户管理',
              component: './SystemManagement/UserManagement',
            },
          ]
        },
        {
          name: '异常页',
          icon: 'warning',
          path: '/exception',
          routes: [
            {
              path: '/exception/403',
              name: '403',
              component: './exception/403',
            },
            {
              path: '/exception/500',
              name: '500',
              component: './exception/500',
            },
          ]
        },
        {
          component: './404',
        },
      ],
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': '#1890FF',
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string;
      },
      _: string,
      localName: string
    ) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const path = match[1].replace('.less', '');
        const arr = slash(path)
          .split('/')
          .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
          .map((a: string) => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  chainWebpack: webpackPlugin,
} as IConfig;
