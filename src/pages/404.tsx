import { Button, Result } from 'antd';
import React from 'react';
import router from 'umi/router';

const NoFoundPage: React.FC<{}> = () => (
  <Result
    status="404"
    title="404"
    subTitle="抱歉，你访问的页面不存在。"
    extra={
      <Button type="primary" onClick={() => router.push('/')}>
         回到首页
      </Button>}
  />
);

export default NoFoundPage;
