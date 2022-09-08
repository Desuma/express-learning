import { isEmpty } from 'lodash';
import mysql, { Pool } from 'mysql';

import { E_MYSQL_ERROR_CODE } from '~/enums';
import { MysqlReponse, MysqlRequest } from '~/types';
import { createDefer } from '~/util';
import { createHijacker } from '~/util/hijacker';

import { getStartParams } from './beforeAppStart';

const hijacker = createHijacker<Pool>();

export const createConnectionPool = (): Pool => {
  const {
    MySQLUser,
    MySQLHost,
    MySQLPassword,
    MySQLPort,
    MySQLDatabase,
  } = getStartParams();

  //创建连接池
  const pool = mysql.createPool({
    host: MySQLHost, // 连接主机名
    user: MySQLUser, // 数据库用户名
    password: MySQLPassword, // 数据库密码
    port: MySQLPort, // 数据库端口
    database: MySQLDatabase, // 数据库名称
    multipleStatements: true, // 允许每个mysql语句有多条查询.使用它时要非常注意，因为它很容易引起sql注入攻击(默认:false).
    waitForConnections: true, // 连接等待时间: 当无连接可用或连接数达到上限的时候，判定连接池动作。如果为true，连接池会将请求加入队列，待可用之时再触发操作；如为false，连接池将立即返回错误（默认值：true)
    acquireTimeout: 10 * 1000, // 获取超时时间: 获取连接时，触发连接超时之前的毫秒数。这与connectTimeout略有不同，因为从连接池获取连接并不总会创建连接（默认值：10000）
    queueLimit: 2000, // 队列数量限制: 在调用getConnection返回错误之前，连接池所允许入队列的最大请求数量。如设置为0，则不限制。
    connectionLimit: 1000, // 连接池所允许入队列的最大请求数量
  });

  hijacker.hijack(pool);

  return pool;
};

export const getConnectionPool = hijacker.get;

export const query = ({
  sql,
  values = [],
  timeout = 10 * 1000
}: MysqlRequest<unknown>): Promise<MysqlReponse> => {
  if (isEmpty(sql)) {
    return Promise.reject({
      code: E_MYSQL_ERROR_CODE.SQL_EMPTY,
      error: new Error('Query statement is empty')
    });
  }

  const pool = getConnectionPool();
  const defer = createDefer<MysqlReponse>();

  // 建立连接
  pool.getConnection((e, connection) => {
    if (e) {
      return defer.reject({
        code: E_MYSQL_ERROR_CODE.CONNECT_FAILD,
        error: e
      })
    };

    connection.query({
      sql,
      values,
      timeout
    }, (error, results) => {
      if (error) {
        defer.reject({ code: E_MYSQL_ERROR_CODE.QUERY_FAILD, error });
      } else {
        defer.resolve({
          code: E_MYSQL_ERROR_CODE.QUERY_SUCCEED,
          data: results
        });
      }
      // 将连接返回到连接池中, 准备让其他人重复使用
      connection.release();
    })
  });

  return defer.promise;
};
