import { ILogParams, Request, Response } from "~/types";

export const createLoggerTemp = (
  req?: Request,
  res?: Response,
  msg: string | Error = '',
  isStart?: boolean
): ILogParams => {
  return {
    msg,
    isStart,
    resquest: req,
    response: res,
  } as ILogParams;
};