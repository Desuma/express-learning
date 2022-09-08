import express from 'express';
import { ParsedQs } from 'qs';

export interface Request<T = any> extends express.Request {
  /**
   * 请求唯一 ID
   */
  requestId?: string;
  body: T;
  query: ParsedQs & T;
};

export interface Response extends express.Response {

};

export interface NextFunction extends express.NextFunction {

};

export interface AppStartParams {
  /**
   * 应用监听端口
   */
  AppPort?: number;
  /**
   * MySQL 登录地址
   */
  MySQLHost: string;
  /**
   * MySQL 监听端口
   */
  MySQLPort: number;
  /**
   * MySQL 登陆用户名
   */
  MySQLUser: string;
  /**
   * MySQL 登录密码
   */
  MySQLPassword: string;
  /**
   * MySQL 连接数据库
   */
  MySQLDatabase: string;
};

export default {
  Request,
  Response
};