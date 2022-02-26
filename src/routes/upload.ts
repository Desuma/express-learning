import express from 'express';
import { isEmpty } from 'lodash';

import { Request, Response } from '~/types';
import { onUpload } from '~/util';

export const uploadRouter = express.Router();

uploadRouter.post('/', (req: Request, res: Response) => {
  onUpload(req, res, err => {
    return isEmpty(err) ? res.send('upload was successed!') : res.send('upload was faild!');;
  });
});

export default uploadRouter;