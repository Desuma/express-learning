import { assign, isEmpty } from 'lodash';
import readlineSync from 'readline-sync';

import {
  E_EXPRESS_DEV_PARAMS,
  E_EXPRESS_PARAMS,
  E_MYSQL_DEV_PARAMS,
  E_MYSQL_PARAMS,
} from '~/enums';
import { isDev } from '~/util';

const getAppPort = (): number => {
  const AppPort = readlineSync.questionInt(
    `App Port(default ${E_EXPRESS_PARAMS.AppPort}, range [80-65535]):`,
    {
      defaultInput: E_EXPRESS_PARAMS.AppPort as unknown as string,
      limit(input: string) {
        const val = parseInt(input);
        return val >= 80 && val <= 65535;
      },
      limitMessage: 'Input valid App Port, please.'
    }
  );

  return AppPort;
};

const getMySQLHost = (): string => {
  const MySQLHost = readlineSync.question(
    `MySQL Hostname(default ${E_MYSQL_PARAMS.Host}):`,
    {
      defaultInput: E_MYSQL_PARAMS.Host as string,
      limit(input: string) {
        return !isEmpty(input);
      },
      limitMessage: 'Input valid MySQL Hostname, please.'
    }
  );

  return MySQLHost;
};

const getMySQLPort = (AppPort: number): number => {
  const MySQLPort = readlineSync.questionInt(
    `MySQL Port(default ${E_MYSQL_PARAMS.Port}, range [80-65535], donot be the some that App Port):`,
    {
      defaultInput: E_MYSQL_PARAMS.Port as string,
      limit(input: string) {
        const val = parseInt(input);
        return val >= 80 && val <= 65535 && val !== AppPort;
      },
      limitMessage: 'Input valid MySQL Port, please.'
    }
  );

  return MySQLPort;
};

const getMySQLUser = (): string => {
  const MySQLUser = readlineSync.question(`MySQL Name:`, {
    limit: /^([^\s]|.)+$/i,
    limitMessage: 'Input cannot be empty.'
  });

  return MySQLUser;
};

const getMySQLPassword = (): string => {
  const MySQLPassword = readlineSync.question(`MySQL Password:`, {
    hideEchoBack: true,
    limit: /^([^\s]|.)+$/i,
    limitMessage: 'Input cannot be empty.'
  });

  return MySQLPassword;
};

const getMySQLDatabase = (): string => {
  const MySQLUser = readlineSync.question(`MySQL Database:`, {
    limit: /^([^\s]|.)+$/i,
    limitMessage: 'Input cannot be empty.'
  });

  return MySQLUser;
};

const params = {
  AppPort: E_EXPRESS_DEV_PARAMS.AppPort,
  MySQLHost: E_MYSQL_DEV_PARAMS.Host,
  MySQLPort: E_MYSQL_DEV_PARAMS.Port,
  MySQLUser: E_MYSQL_DEV_PARAMS.User,
  MySQLPassword: E_MYSQL_DEV_PARAMS.Password,
  MySQLDatabase: E_MYSQL_DEV_PARAMS.Database,
};

if (!isDev()) {
  const AppPort = getAppPort();
  const MySQLHost = getMySQLHost();
  const MySQLPort = getMySQLPort(AppPort);
  const MySQLUser = getMySQLUser();
  const MySQLPassword = getMySQLPassword();
  const MySQLDatabase = getMySQLDatabase();

  assign(params, {
    AppPort,
    MySQLHost,
    MySQLPort,
    MySQLUser,
    MySQLPassword,
    MySQLDatabase,
  });
}

export default {
  AppPort: params.AppPort,
  mysqlClientConfig: {
    mysql: { // 数据库存连接配置
      // host
      host: params.MySQLHost,
      // 端口号
      port: params.MySQLPort,
      // 用户名
      user: params.MySQLUser,
      // 密码
      password: params.MySQLPassword,
      // 数据库名
      database: params.MySQLDatabase,
    },
    config: config => { // 数据库工具配置
      // 自定义operator
      config.registerOperator('ne', ({ field, value }) => {
        return { sql: '?? <> ?', arg: [field, value] };
      });

      // 自定义ignore
      config.registerIgnore('ifNumber', ({ value }) => {
        return !isNaN(Number(value));
      });

      // 监听事件 执行前
      config.onBeforeExecute(function ({ sql }) {
        console.log(sql);
      });

      // 监听事件 执行后
      config.onAfterExecute(function ({ sql, result }) {
        console.log(result);
      });

      // 监听事件 执行出错
      config.onExecuteError(function ({ sql, error }) {
        console.log(error);
      });
    },
  },
};