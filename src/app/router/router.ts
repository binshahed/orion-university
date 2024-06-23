import { Application, Request, Response } from 'express'
import { StudentRouter } from '../modules/student/student.router'
import { userRouter } from '../modules/user/user.router'
import { academicSemesterRouter } from '../modules/academicSemester/academicSemester.router'
import { academicFacultyRouter } from '../modules/academicFaculty/academicFaculty.router'
import { academicDepartmentRouter } from '../modules/academicDepartment/academicDepartment.router'
import { facultyRouter } from '../modules/faculty/faculty.router'
import { adminRouter } from '../modules/admin/admin.router'
import { courseRouter } from '../modules/course/course.router'
import { semesterRegistrationRouter } from '../modules/semesterRegistration/semesterRegistration.router'
import { offeredCourseRouter } from '../modules/offerdCourse/offeredCourse.router'

const modulesRouters = [
  {
    path: '/api/v1/students',
    route: StudentRouter,
  },
  {
    path: '/api/v1/faculties',
    route: facultyRouter,
  },
  {
    path: '/api/v1/admin',
    route: adminRouter,
  },
  {
    path: '/api/v1/users',
    route: userRouter,
  },
  {
    path: '/api/v1/course',
    route: courseRouter,
  },
  {
    path: '/api/v1/academic-semester',
    route: academicSemesterRouter,
  },
  {
    path: '/api/v1/academic-faculty',
    route: academicFacultyRouter,
  },
  {
    path: '/api/v1/academic-department',
    route: academicDepartmentRouter,
  },
  {
    path: '/api/v1/semester-registration',
    route: semesterRegistrationRouter,
  },
  {
    path: '/api/v1/offered-course',
    route: offeredCourseRouter,
  },
]

export const routes = (app: Application) => {
  // root route
  app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
  })

  // all routes
  modulesRouters.forEach((router) => app.use(router.path, router.route))

  // not found route
  app.route('*').all((req: Request, res: Response) => {
    res.send('Route Not Found!')
  })
}
