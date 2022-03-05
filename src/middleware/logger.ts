import logger from 'morgan';
import path from 'path';
import fileStrameRotato from 'file-stream-rotator';

import { formatLogLevel, isDev } from '~/util';
import { Request, Response, StreamParams } from '~/types';
import { E_LOG_LEVEL, E_LOG_LEVEL_ENUM } from '~/enums';

/**
 * 最低日志打印等级
 */
const LOG_LEVEL_MIN = isDev() ? E_LOG_LEVEL_ENUM.INFO : E_LOG_LEVEL_ENUM.WARNING;

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

export default accessLog;