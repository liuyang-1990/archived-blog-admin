import React from "react";
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';

export function rootContainer(container) {
    return React.createElement(ConfigProvider, { locale: zh_CN }, container);
}
