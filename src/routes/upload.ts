import express from 'express';
import { assign, isEmpty } from 'lodash';

import { Request, Response } from '~/types';
import { Ilogger, onUpload } from '~/util';
import { createLoggerTemp } from '~/template';

export const uploadRouter = express.Router();

uploadRouter.post('/', (req: Request, res: Response) => {
  const uploadMsg = createLoggerTemp(req, res);
  onUpload(req, res, err => {
    if (isEmpty(err)) {
      assign(uploadMsg, { msg: 'upload was successed!' });
      Ilogger.info(uploadMsg);

      res.send('upload was successed!')
    } else {
      assign(uploadMsg, { msg: err });
      Ilogger.error(uploadMsg);

      res.send('upload was faild!');
    }
  });
});

export default uploadRouter;