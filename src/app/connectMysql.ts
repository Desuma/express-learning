import mysql, { Pool } from 'mysql';

import { getStartParams } from './beforeStart';

let pool: Pool;

export const createConnectionPool = (): Pool => {
  const {
    MySQLName,
    MySQLHost,
    MySQLPassword,
    MySQLPort,
    MySQLDatabase,
  } = getStartParams();

  //创建连接池
  pool = mysql.createPool({
    host: MySQLHost, // 连接主机名
    user: MySQLName, // 数据库用户名
    password: MySQLPassword, // 数据库密码
    port: MySQLPort, // 数据库端口
    database: MySQLDatabase, // 数据库名称
    multipleStatements: true, // 允许每个mysql语句有多条查询.使用它时要非常注意，因为它很容易引起sql注入攻击(默认:false).
    waitForConnections: true, // 连接等待时间: 当无连接可用或连接数达到上限的时候，判定连接池动作。如果为true，连接池会将请求加入队列，待可用之时再触发操作；如为false，连接池将立即返回错误（默认值：true)
    acquireTimeout: 10 * 1000, // 获取超时时间: 获取连接时，触发连接超时之前的毫秒数。这与connectTimeout略有不同，因为从连接池获取连接并不总会创建连接（默认值：10000）
    queueLimit: 2000, // 队列数量限制: 在调用getConnection返回错误之前，连接池所允许入队列的最大请求数量。如设置为0，则不限制。
    connectionLimit: 1000, // 连接池所允许入队列的最大请求数量
  });

  return pool;
};

export const getConnectionPool = (): Pool => pool;