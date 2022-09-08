import { assign, isEmpty } from 'lodash';
import readlineSync from 'readline-sync';

import { E_EXPRESS_DEV_PARAMS, E_EXPRESS_PARAMS, E_MYSQL_DEV_PARAMS, E_MYSQL_PARAMS } from '~/enums';
import { AppStartParams } from '~/types';
import { createHijacker, Ilogger, isDev } from '~/util';

const hijacker = createHijacker<AppStartParams>();

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
  const MySQLUser = readlineSync.question(`MySQL Name:`, {
    limit: /^([^\s]|.)+$/i,
    limitMessage: 'Input cannot be empty.'
  });

  return MySQLUser;
};

export const beforeAppStart = () => {
  Ilogger.info({
    msg: 'Before start initiating app.',
    isStart: true
  });

  const params = {
    AppPort: E_EXPRESS_DEV_PARAMS.AppPort,
    MySQLHost: E_MYSQL_DEV_PARAMS.Host,
    MySQLPort: E_MYSQL_DEV_PARAMS.Port,
    MySQLUser: E_MYSQL_DEV_PARAMS.User,
    MySQLPassword: E_MYSQL_DEV_PARAMS.Password,
    MySQLDatabase: E_MYSQL_DEV_PARAMS.Database,
  } as AppStartParams;

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

  hijacker.hijack(params);

  Ilogger.info({
    msg: 'Before start initiating app. Done.',
    isStart: true
  });
};

export const getStartParams = (): AppStartParams => {
  return { ...(hijacker.get()) } as AppStartParams;
};