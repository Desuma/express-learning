import { E_LOG_LEVEL_ENUM } from "~/enums";

import { Request, Response } from './express';

export interface StreamParams {
  /**
   * 日志保存路径及文件名
   */
  filename?: string;
  /**
   * 日志打印周期
   */
  frequency: string;
  /**
   * 我也不知道
   */
  verbose: boolean;
  /**
   * 日期形式
   */
  data_format: string;
};

export interface ILogParams {
  /**
   * 日志信息
   */
  msg?: string | Error;
  /**
   * 是否是启动日志
   */
  isStart?: boolean;
  /**
   * Request
   */
  resquest?: Request;
  /**
   * Response
   */
  response?: Response;
};

export interface IDoLogParams extends ILogParams {
  /**
   * 日志级别
   */
  level: E_LOG_LEVEL_ENUM;
};