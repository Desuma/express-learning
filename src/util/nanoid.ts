import { Request, Response, NextFunction } from '../types';
import { nanoid } from 'nanoid';

export const accessNanoid = (req: Request, _res: Response, next: NextFunction) => {
  req.requestId = nanoid();
  next();
};

export default accessNanoid;