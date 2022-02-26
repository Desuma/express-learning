import express from 'express';

export interface Request extends express.Request {
  /**
   * 请求唯一 ID
   */
  requestId?: string;
}

export interface Response extends express.Response {

}

export interface NextFunction extends express.NextFunction {

}

export interface AppParams {
  /**
   * 应用监听端口
   */
  AppPort: number;
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
  MySQLName: string;
  /**
   * MySQL 登录密码
   */
  MySQLPassword: string;
}

export default {
  Request,
  Response
}