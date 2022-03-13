import { getConnectionPool } from "~/app";
import { E_MYSQL_ERROR_CODE, E_QUERY_SQL } from "~/enums";
import { MysqlReponse, MysqlRequest, QueryUser, QueryUserParams } from "~/types";

const pool = getConnectionPool();

export const query = ({
  sql,
  values = [],
  timeout = 10 * 1000
}: MysqlRequest<unknown>): Promise<MysqlReponse> => {
  if (!sql) {
    return Promise.reject({
      code: E_MYSQL_ERROR_CODE.SQL_EMPTY,
      error: new Error('Query statement is empty')
    });
  }

  return new Promise((resolve, reject) => {
    // 建立连接
    pool.getConnection((e, connection) => {
      if (e) {
        return reject({
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
          reject({ code: E_MYSQL_ERROR_CODE.QUERY_FAILD, error });
        } else {
          resolve({
            code: E_MYSQL_ERROR_CODE.QUERY_SUCCEED,
            data: results
          });
        }
        // 将连接返回到连接池中, 准备让其他人重复使用
        connection.release();
      })
    });
  });
};

export const queryUser = ({
  username,
  password
}: QueryUserParams): Promise<MysqlReponse> => {
  return query({
    sql: E_QUERY_SQL.USER,
    values: [username, password]
  } as MysqlRequest<QueryUser>);
};