/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import config from '../config';

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = err.statusCode || 500;
  let message = 'Something went wrong';
  let errors = undefined;

  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation error';
    errors = err.errors;
  } else if (err instanceof Error) {
    message = err.message;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    // Only include stack trace in development mode
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
};

export default globalErrorHandler;
