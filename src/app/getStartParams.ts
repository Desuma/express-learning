import { isEmpty } from 'lodash';
import readlineSync from 'readline-sync';

import { E_EXPRESS_DEV_PARAMS, E_EXPRESS_PARAMS } from '~/enums';
import { AppParams } from '~/types';
import { isDev } from '~/util';

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
    `MySQL Hostname(default ${E_EXPRESS_PARAMS.MySQLHost}):`,
    {
      defaultInput: E_EXPRESS_PARAMS.MySQLHost,
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
    `MySQL Port(default ${E_EXPRESS_PARAMS.MySQLPort}, range [80-65535], donot be the some that App Port):`,
    {
      defaultInput: E_EXPRESS_PARAMS.MySQLPort,
      limit(input: number) {
        return input >= 80 && input <= 65535 && input !== AppPort;
      },
      limitMessage: 'Input valid MySQL Port, please.'
    }
  );

  return MySQLPort;
};

const getMySQLName = (): string => {
  const MySQLName = readlineSync.question(`MySQL Name:`, {
    limit: /^([^\s]|.)+$/i,
    limitMessage: 'Input cannot be empty.'
  });

  return MySQLName;
};

const getMySQLPassword = (): string => {
  const MySQLPassword = readlineSync.question(`MySQL Password:`, {
    hideEchoBack: true,
    limit: /^([^\s]|.)+$/i,
    limitMessage: 'Input cannot be empty.'
  });

  return MySQLPassword;
};

export const getStartParams = () => {
  let AppPort: number;
  let MySQLHost: string;
  let MySQLPort: number;
  let MySQLName: string;
  let MySQLPassword: string;

  if (isDev()) {
    AppPort = E_EXPRESS_DEV_PARAMS.AppPort;
    MySQLHost = E_EXPRESS_DEV_PARAMS.MySQLHost;
    MySQLPort = E_EXPRESS_DEV_PARAMS.MySQLPort;
    MySQLName = E_EXPRESS_DEV_PARAMS.MySQLName;
    MySQLPassword = E_EXPRESS_DEV_PARAMS.MySQLPassword;
  } else {
    AppPort = getAppPort();
    MySQLHost = getMySQLHost();
    MySQLPort = getMySQLPort(AppPort);
    MySQLName = getMySQLName();
    MySQLPassword = getMySQLPassword();
  }

  return {
    AppPort,
    MySQLHost,
    MySQLPort,
    MySQLName,
    MySQLPassword,
  } as AppParams;
};