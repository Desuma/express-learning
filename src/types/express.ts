import express from 'express';
import { ParsedQs } from 'qs';

export interface Request<T = any> extends express.Request {
  /**
   * 请求唯一 ID
   */
  requestId?: string;
  body: T | undefined;
  query: ParsedQs;
  db?: any,
};

export interface Response<T = any> extends express.Response {
  // data: T | undefined;
  // error: string | undefined;
  // code: number;
  // requestId: string;
  queryData?: T;
};

export interface NextFunction extends express.NextFunction {

};

export default {
  Request,
  Response
};