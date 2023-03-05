import logger, { TokenIndexer } from 'morgan';
import path from 'path';
import fileStrameRotato from 'file-stream-rotator';
import { assign, cloneDeep } from 'lodash';

import { formatLogLevel, isDev } from '~/util';
import { Request, Response, StreamParams } from '~/types';
import { E_LOG_LEVEL_ENUM } from '~/enums';

/**
 * 最低日志打印等级
 */
const LOG_LEVEL_MIN = isDev() ? E_LOG_LEVEL_ENUM.INFO : E_LOG_LEVEL_ENUM.WARNING;

const maskConfig = {
  '/user/login': ['username', 'password'],
}

const maskBody = (route: string, body: any) => {
  const maskParams = maskConfig[route];
  const cloneBody = cloneDeep(body);

  maskParams?.forEach?.((param: string) => assign(cloneBody, { [param]: '******' }));

  return JSON.stringify(cloneBody);
};

const formatLog = (
  level: E_LOG_LEVEL_ENUM,
  tokens: TokenIndexer<Request, Response>,
  req: Request,
  res: Response
) => {
  const route = decodeURI(tokens.url(req, res) ?? '');

  return [
    `[${formatLogLevel(level)}]`,
    `[${tokens.method(req, res)}]`,
    tokens.status(req, res),
    tokens.res(req, res, 'requestId'),
    new Date().toLocaleString('zh-CN', { hour12: false }),
    route,
    maskBody(route, req.body),
    tokens.res(req, res, 'content-length'),
    '-',
    tokens['response-time'](req, res),
    'ms'
  ].join(' ');
};

const getAccessLogLevel = (res: Response): E_LOG_LEVEL_ENUM => {
  if (res.statusCode < 300) {
    return E_LOG_LEVEL_ENUM.INFO;
  } else if (res.statusCode < 400) {
    return E_LOG_LEVEL_ENUM.WARNING;
  } else {
    return E_LOG_LEVEL_ENUM.ERROR;
  }
};

const checkAccessLogLevel = (res: Response): boolean => {
  return getAccessLogLevel(res) >= LOG_LEVEL_MIN;
};

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
    tokens, req: Request, res: Response
  ) => {
    return formatLog(getAccessLogLevel(res), tokens, req, res);
  },
  {
    stream: accessLogStream,
    skip(_req: Request, res: Response) {
      return !checkAccessLogLevel(res);
    }
  }
);

export default accessLog;