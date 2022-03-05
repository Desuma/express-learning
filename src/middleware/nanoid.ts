import { nanoid } from 'nanoid';

import { Request, Response, NextFunction } from '~/types';

export const accessNanoid = (req: Request, _res: Response, next: NextFunction) => {
  req.requestId = nanoid();
  next();
};

export default accessNanoid;