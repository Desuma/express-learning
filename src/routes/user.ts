import express from 'express';

import { queryUser } from '~/query';
import { QueryUserParams, Request, Response } from '~/types';
import { Ilogger } from '~/util';

export const userRouter = express.Router();

userRouter.get('/login', async (req: Request<QueryUserParams>, res: Response) => {
  Ilogger.info({
    msg: 'login successed!',
    resquest: req,
  });

  const { username, password } = req?.query ?? {};

  const info = await queryUser({ username, password });

  res.send('login successed!');
});

userRouter.post('/login', async (req: Request<QueryUserParams>, res: Response) => {
  Ilogger.info({
    msg: 'login successed!',
    resquest: req,
  });

  const { username, password } = req?.body ?? {};

  const info = await queryUser({ username, password });

  res.send('login successed2!');
});

export default userRouter;