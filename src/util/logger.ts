import logger from 'morgan';
import fileStrameRotato from 'file-stream-rotator';
import path from 'path';
import { assign, isError } from 'lodash';

import { IDoLogParams, ILogParams, Request, Response, StreamParams } from '~/types';
import { E_LOG_LEVEL, E_LOG_LEVEL_ENUM } from '~/enums';

import isDev from './express';

/**
 * 最低日志打印等级
 */
const LOG_LEVEL_MIN = isDev() ? E_LOG_LEVEL_ENUM.INFO : E_LOG_LEVEL_ENUM.WARNING;

/**
 * 生成access日志文件及所在目录
 */
const logFile = (isDev() ? '../../' : '../') + 'log/access-%DATE%.log';

const accessLogStream = fileStrameRotato.getStream({
  filename: path.resolve(__dirname, logFile),
  frequency: 'daily',
  verbose: false,
  data_format: 'YYYYMMDD'
} as StreamParams);

const formatLogLevel = (level: E_LOG_LEVEL = E_LOG_LEVEL.INFO): E_LOG_LEVEL => E_LOG_LEVEL[level];

const formatLog = (level: E_LOG_LEVEL, tokens: any, req: Request, res: Response) => {
  return [
    `[${formatLogLevel(level)}]`,
    `[${tokens.method(req, res)}]`,
    tokens.status(req, res),
    tokens.res(req, res, 'requestId'),
    new Date().toLocaleString('zh-CN', { hour12: false }),
    decodeURI(tokens.url(req, res)),
    JSON.stringify(req.body),
    tokens.res(req, res, 'content-length'),
    '-',
    tokens['response-time'](req, res),
    'ms'
  ].join(' ');
};

const getAccessLogLevel = (res: Response): E_LOG_LEVEL => {
  let level: E_LOG_LEVEL;

  if (res.statusCode < 300) {
    level = E_LOG_LEVEL.INFO;
  } else if (res.statusCode < 400) {
    level = E_LOG_LEVEL.WARNING;
  } else {
    level = E_LOG_LEVEL.ERROR;
  }

  return level;
};

const checkAccessLogLevel = (res: Response): boolean => E_LOG_LEVEL_ENUM[getAccessLogLevel(res)] >= LOG_LEVEL_MIN;

export const accessLog = logger(
  (
    tokens: any, req: Request, res: Response
  ) => {
    return formatLog(getAccessLogLevel(res), tokens, req, res);
  },
  {
    stream: accessLogStream,
    skip(_req: Request, res: Response) {
      return checkAccessLogLevel(res);
    }
  }
);

/**
 * 生成running日志文件及所在目录
 */
const runningLogFile = (isDev() ? '../../' : '../') + 'log/running-%DATE%.log';

const runningLogStream = fileStrameRotato.getStream({
  filename: path.resolve(__dirname, runningLogFile),
  frequency: 'daily',
  verbose: false,
  data_format: 'YYYYMMDD'
} as StreamParams);

const checkRunningLogLevel = (level: E_LOG_LEVEL_ENUM): boolean => level >= LOG_LEVEL_MIN;

const formatRunningLog = (level: E_LOG_LEVEL, msg: Error | string, req?: Request): string => {
  return [
    `[${formatLogLevel(level)}]`,
    `[${req?.method ?? 'LOGGER'}]`,
    `[${req?.requestId ?? 'noRequestId'}]`,
    new Date().toLocaleString('zh-CN', { hour12: false }),
    isError(msg) ? `[${msg.name}] ${msg.message}` : msg,
    '\n'
  ].join(' ');
};

const doLog = ({ level, msg, isStart, resquest: req }: IDoLogParams) => {
  const logMsg = formatRunningLog(E_LOG_LEVEL[level], msg, req);

  (isStart || checkRunningLogLevel(level)) && runningLogStream.write(logMsg);
};

export const logInfo = (params: ILogParams) => {
  doLog(assign(params, {
    level: E_LOG_LEVEL_ENUM.INFO
  }));
};

export const logWarning = (params: ILogParams) => {
  doLog(assign(params, {
    level: E_LOG_LEVEL_ENUM.WARNING
  }));
};

export const logError = (params: ILogParams) => {
  doLog(assign(params, {
    level: E_LOG_LEVEL_ENUM.ERROR
  }));
};

export const Ilogger = {
  info: logInfo,
  warning: logWarning,
  error: logError,
  accessLog
};

export default Ilogger;