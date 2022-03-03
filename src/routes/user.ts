import express from 'express';

import { Request, Response } from '~/types';
import { Ilogger } from '~/util';

export const userRouter = express.Router();

userRouter.get('/login', (req: Request, res: Response) => {
  Ilogger.info({
    msg: 'login successed!',
    resquest: req,
  });
  res.send('login successed!');
});

export default userRouter;