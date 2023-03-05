import express from 'express';
import { assign, isEmpty } from 'lodash';
import { rsaDecrypt } from '~/jsrsasign';

import { createLoggerTemp } from '~/template';
import { QueryUserParams, Request, Response } from '~/types';
import { Ilogger } from '~/util';

export const userRouter = express.Router();

userRouter.post('/login', async (req: Request<QueryUserParams>, res: Response) => {
  const loginMsg = createLoggerTemp(req, res);
  const { body, requestId, db } = req;
  const { username, password: pwd = '', isEncrypt } = body ?? {};
  const password = isEncrypt ? rsaDecrypt(pwd) : pwd;

  const userData = await db
    .select('*')
    .from('user')
    .where('username', username)
    .where('password', password)
    .queryList();

  if (isEmpty(userData)) {
    const code = 'LoginFaild.NotFoundUser';
    const error = new Error(code);

    res.send({
      error: {
        code,
        msg: 'Login faild. Plase check username or password.'
      },
      code: 200,
      requestId,
    });

    assign(loginMsg, { error });

    return Ilogger.error(loginMsg);
  }

  res.send({
    data: 'login successed!',
    code: 200,
    requestId,
  });

  Ilogger.info(loginMsg);
});

export default userRouter;