import express from 'express';
import path from 'path';

import { accessLog, accessNanoid, Ilogger } from '~/util';
import { uploadRouter, userRouter } from '~/routes';

export const crreateApp = (PORT?: number) => {
  Ilogger.info({
    msg: 'Begin to start initiating app.',
    isStart: true
  });

  const app = express();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use(accessNanoid);
  app.use(accessLog);

  /**
   * 托管静态资源。静态资源可以不带起始路由
   */
  app.use(express.static(path.resolve(__dirname, '../../public'), { index: 'index.html' }));

  /**
   * 使用路由
   */
  app.use('/user', userRouter);
  app.use('/upload', uploadRouter);

  /**
   * 监听端口并启动项目
   */
  app.listen(PORT, () => {
    const logMsg = `App is runing! http://localhost:${PORT}`;

    Ilogger.info({
      msg: logMsg,
      isStart: true
    });

    console.log(logMsg);
  });
};

export default crreateApp;