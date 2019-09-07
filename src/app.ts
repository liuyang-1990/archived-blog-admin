import React from "react";
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

export function rootContainer(container) {
    moment.locale('zh-cn');
    return React.createElement(ConfigProvider, { locale: zh_CN }, container);
}
