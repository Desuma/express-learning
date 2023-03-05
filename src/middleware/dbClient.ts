import DBClent from 'ali-mysql-client';

import { Request, Response, NextFunction } from '~/types';

export const dbClent = (config: any) => {
  const db = new DBClent(config);

  return (req: Request, _res: Response, next: NextFunction) => {
    req.db = db;
    next();
  };
};

export default dbClent;