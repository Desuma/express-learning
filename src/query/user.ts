import { query } from "~/app";
import { E_QUERY_SQL } from "~/enums";
import { MysqlReponse, MysqlRequest, QueryUser, QueryUserParams } from "~/types";

export const queryUser = ({
  username,
  password
}: QueryUserParams): Promise<MysqlReponse> => {
  return query({
    sql: E_QUERY_SQL.USER,
    values: [username, password]
  } as MysqlRequest<QueryUser>);
};