import { Application, Request, Response } from 'express';
import { StudentRouter } from '../modules/student/student.router';
import { userRouter } from '../modules/user/user.router';

export const routes = (app: Application) => {
  // root route
  app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
  });

  //  students
  app.use('/api/v1/students', StudentRouter);

  // users
  app.use('/api/v1/users', userRouter);

  // not found route
  app.route('*').all((req: Request, res: Response) => {
    res.send('Route Not Found!');
  });
};
