export enum E_MYSQL_PARAMS {
  /**
   * 数据库连接端口号
   */
  Port = 3000,
  /**
   * 数据库连接地址
   */
  Host = 'localhost',
};

export enum E_MYSQL_DEV_PARAMS {
  /**
   * 数据库连接地址
   */
  Host = 'localhost',
  /**
   * 数据库连接端口号
   */
  Port = 3306,
  /**
   * 数据库连接用户名
   */
  User = 'root',
  /**
   * 数据库连接密码
   */
  Password = 'password',
  /**
 * 连接数据库名称
 */
  Database = 'myserver',
};


export enum E_MYSQL_ERROR_CODE {
  /**
   * 查询成功
   */
  QUERY_SUCCEED = 10000,
  /**
   * 空查询语句
   */
  SQL_EMPTY = 10001,
  /**
   * 建立连接失败
   */
  CONNECT_FAILD = 10002,
  /**
   * 查询失败
   */
  QUERY_FAILD = 10003,
};

export enum E_QUERY_SQL {
  /**
   * 查询指定用户
   */
  USER = 'SELECT * FROM user WHERE username=? & password=?;',
};