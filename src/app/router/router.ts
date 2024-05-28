import { Application, Request, Response } from 'express';
import { StudentRouter } from '../modules/student/student.router';
import { userRouter } from '../modules/user/user.router';
import { academicSemesterRouter } from '../modules/academicSemester/academicSemester.router';

const modulesRouters = [
  {
    path: '/api/v1/students',
    route: StudentRouter,
  },
  {
    path: '/api/v1/users',
    route: userRouter,
  },
  {
    path: '/api/v1/academic-semester',
    route: academicSemesterRouter,
  },
];

export const routes = (app: Application) => {
  // root route
  app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
  });

  // all routes
  modulesRouters.forEach((router) => app.use(router.path, router.route));

  // not found route
  app.route('*').all((req: Request, res: Response) => {
    res.send('Route Not Found!');
  });
};
