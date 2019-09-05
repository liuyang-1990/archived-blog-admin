import { Button, Result } from 'antd';
import React from 'react';
import router from 'umi/router';

const Exception403: React.FC<{}> = () => (
  <Result
    status="403"
    title="403"
    subTitle="抱歉，你无权访问该页面。"
    extra={
      <Button type="primary" onClick={() => router.push('/')}>
         回到首页
      </Button>}
  />
);

export default Exception403;
