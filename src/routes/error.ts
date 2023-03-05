import express from 'express';

import { createLoggerTemp } from '~/template';
import { QueryUserParams, Request, Response } from '~/types';
import { Ilogger } from '~/util';

export const errorRouter = express.Router();

errorRouter.all('*', async (req: Request<QueryUserParams>, res: Response) => {
  const errorMsg = createLoggerTemp(req, res, `Not found route: ${req.baseUrl}`);

  Ilogger.error(errorMsg);

  res.status(404).send(`Not found route: ${req.baseUrl}`);
});

export default errorRouter;