import { Response } from 'express';
import httpStatus from 'http-status';

type TData<T> = {
  success: boolean;
  message: string;
  data: T;
};

const sendResponse = <T>(res: Response, data: TData<T>) => {
  res.status(httpStatus.OK).send({
    success: true,
    message: data.message,
    data: data.data,
  });
};

export default sendResponse;
