import { assign, isEmpty } from 'lodash';
import readlineSync from 'readline-sync';

import { E_EXPRESS_DEV_PARAMS, E_EXPRESS_PARAMS, E_MYSQL_DEV_PARAMS, E_MYSQL_PARAMS } from '~/enums';
import { AppParams } from '~/types';
import { Ilogger, isDev } from '~/util';

const params: AppParams = {};

const getAppPort = (): number => {
  const AppPort = readlineSync.questionInt(
    `App Port(default ${E_EXPRESS_PARAMS.AppPort}, range [80-65535]):`,
    {
      defaultInput: E_EXPRESS_PARAMS.AppPort,
      limit(input: number) {
        return input >= 80 && input <= 65535;
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
      defaultInput: E_MYSQL_PARAMS.Host,
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
      defaultInput: E_MYSQL_PARAMS.Port,
      limit(input: number) {
        return input >= 80 && input <= 65535 && input !== AppPort;
      },
      limitMessage: 'Input valid MySQL Port, please.'
    }
  );

  return MySQLPort;
};

const getMySQLName = (): string => {
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

export const beforeStart = () => {
  let AppPort: number;
  let MySQLHost: string;
  let MySQLPort: number;
  let MySQLUser: string;
  let MySQLPassword: string;
  let MySQLDatabase: string;

  Ilogger.info({
    msg: 'Before start initiating app.',
    isStart: true
  });

  if (isDev()) {
    AppPort = E_EXPRESS_DEV_PARAMS.AppPort;
    MySQLHost = E_MYSQL_DEV_PARAMS.Host;
    MySQLPort = E_MYSQL_DEV_PARAMS.Port;
    MySQLUser = E_MYSQL_DEV_PARAMS.User;
    MySQLPassword = E_MYSQL_DEV_PARAMS.Password;
    MySQLDatabase = E_MYSQL_DEV_PARAMS.Database;
  } else {
    AppPort = getAppPort();
    MySQLHost = getMySQLHost();
    MySQLPort = getMySQLPort(AppPort);
    MySQLUser = getMySQLName();
    MySQLPassword = getMySQLPassword();
    MySQLDatabase = getMySQLDatabase();
  }

  assign(params, {
    AppPort,
    MySQLHost,
    MySQLPort,
    MySQLUser,
    MySQLPassword,
    MySQLDatabase,
  });

  Ilogger.info({
    msg: 'Before start initiating app. Done.',
    isStart: true
  });
};

export const getStartParams = (): AppParams => {
  return { ...params };
};