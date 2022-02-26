import express from 'express';

import { Request, Response } from '~/types';

export const userRouter = express.Router();

userRouter.get('/login', (_req: Request, res: Response) => {
  res.send('login successed!');
});

export default userRouter;