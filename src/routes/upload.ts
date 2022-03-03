import express from 'express';
import { isEmpty } from 'lodash';

import { Request, Response } from '~/types';
import { Ilogger, onUpload } from '~/util';

export const uploadRouter = express.Router();

uploadRouter.post('/', (req: Request, res: Response) => {
  onUpload(req, res, err => {
    if (isEmpty(err)) {
      Ilogger.info({
        msg: 'upload was successed!',
        resquest: req,
      });

      res.send('upload was successed!')
    } else {
      Ilogger.error({
        msg: err,
        resquest: req,
      });

      res.send('upload was faild!')
    }
  });
});

export default uploadRouter;