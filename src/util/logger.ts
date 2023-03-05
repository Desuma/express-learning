import fileStrameRotato from 'file-stream-rotator';
import path from 'path';
import { assign, isError, keys } from 'lodash';

import { IDoLogParams, ILogParams, Request, Response, StreamParams } from '~/types';
import { E_LOG_LEVEL_ENUM } from '~/enums';

import { isDev } from './express';

/**
 * 最低日志打印等级
 */
const LOG_LEVEL_MIN = isDev() ? E_LOG_LEVEL_ENUM.INFO : E_LOG_LEVEL_ENUM.WARNING;

export const formatLogLevel = (level: E_LOG_LEVEL_ENUM = E_LOG_LEVEL_ENUM.INFO): E_LOG_LEVEL_ENUM => E_LOG_LEVEL_ENUM[level.toString()];

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

const formatRunningLog = (level: E_LOG_LEVEL_ENUM, msg?: Error | string, req?: Request, res?: Response): string => {
  return [
    `[${formatLogLevel(level)}]`,
    `[${req?.method ?? 'LOGGER'}]`,
    `[${req?.requestId ?? 'noRequestId'}]`,
    new Date().toLocaleString('zh-CN', { hour12: false }),
    isError(msg) ? `[${msg.name}] ${msg.message}` : msg,
    '\n'
  ].join(' ');
};

const runningLog = ({ level, msg, isStart, resquest, response }: IDoLogParams) => {
  const logMsg = formatRunningLog(level, msg, resquest, response);

  (isStart || checkRunningLogLevel(level)) && runningLogStream.write(logMsg);
};

export const logInfo = (params: ILogParams) => {
  runningLog(assign(params, {
    level: E_LOG_LEVEL_ENUM.INFO
  }));
};

export const logWarning = (params: ILogParams) => {
  runningLog(assign(params, {
    level: E_LOG_LEVEL_ENUM.WARNING
  }));
};

export const logError = (params: ILogParams) => {
  runningLog(assign(params, {
    level: E_LOG_LEVEL_ENUM.ERROR
  }));
};

export const Ilogger = {
  info: logInfo,
  warning: logWarning,
  error: logError,
};