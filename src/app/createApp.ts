import express from 'express';
import path from 'path';
import cors from 'cors';
import { assign } from 'lodash';

import { Ilogger } from '~/util';
import { errorRouter, uploadRouter, userRouter } from '~/routes';
import { accessLog, accessNanoid, dbClent } from '~/middleware';
import { createLoggerTemp } from '~/template';
import { createRsa } from '~/jsrsasign';

import config from './config';

export const createApp = () => {
  const createinfo = createLoggerTemp();

  assign(createinfo, { isStart: true });
  assign(createinfo, { msg: 'Begin to start initiating app.' });
  Ilogger.info(createinfo);

  createRsa();

  const { AppPort, mysqlClientConfig } = config;
  const app = express();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cors({
    origin: ["*"],
    credentials: true, // 允许携带session
    optionsSuccessStatus: 200
  }));
  /**
   * 托管静态资源。静态资源可以不带起始路由
   */
  app.use(express.static(path.resolve(__dirname, '../../public'), { index: 'index.html' }));

  app.use(accessNanoid);
  app.use(accessLog);
  app.use(dbClent(mysqlClientConfig));

  /**
   * 使用路由
   */
  app.use('/user', userRouter);
  app.use('/upload', uploadRouter);
  app.use('*', errorRouter);

  /**
   * 监听端口并启动项目
   */
  app.listen(AppPort, () => {
    const msg = `App is runing! http://localhost:${AppPort}`;

    assign(createinfo, { msg: 'Begin to start initiating app.' });
    Ilogger.info(createinfo);

    console.log(msg);
  });
};

export default createApp;