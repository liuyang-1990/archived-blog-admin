import { Button, Result } from '@/pages/Exception/node_modules/antd';
import React from '@/pages/Exception/node_modules/react';
import router from '@/pages/Exception/node_modules/umi/router';

const Exception500: React.FC<{}> = () => (
  <Result
    status="500"
    title="500"
    subTitle="抱歉，服务器出错了。"
    extra={
      <Button type="primary" onClick={() => router.push('/')}>
         回到首页
      </Button>}
  />
);

export default Exception500;
