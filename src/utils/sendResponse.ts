import { Response } from 'express';

type TData<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
};

const sendResponse = <T>(res: Response, data: TData<T>) => {
  res.status(data?.statusCode).send({
    success: true,
    message: data.message,
    data: data.data,
  });
};

export default sendResponse;
