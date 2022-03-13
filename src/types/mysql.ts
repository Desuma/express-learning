import { MysqlError } from "mysql";

export interface MysqlRequest<T = undefined> {
  sql: string;
  values?: T;
  timeout?: number;
};

export interface MysqlReponse {
  code?: number;
  data?: any;
  error?: Error | MysqlError;
};

export interface QueryUserParams {
  username: string;
  password: string;
};

export type QueryUser = [string, string];
