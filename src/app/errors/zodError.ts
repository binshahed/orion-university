import { ZodError, ZodIssue } from 'zod';
import { TErrorSource } from '../interface/error.interface';

export const handleZodError = (err: ZodError) => {
  const errorSource: TErrorSource = err.issues.map((issue: ZodIssue) => ({
    path: issue?.path[issue.path.length - 1].toString(),
    message: issue?.message,
  }));

  const statusCode = 400;

  return {
    statusCode,
    message: 'Validation error',
    errorSource,
  };
};
