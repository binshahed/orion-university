import { Application, Request, Response } from 'express'
import { StudentRouter } from '../modules/student/student.routes'
import { userRouter } from '../modules/user/user.routes'
import { academicSemesterRouter } from '../modules/academicSemester/academicSemester.routes'
import { academicFacultyRouter } from '../modules/academicFaculty/academicFaculty.routes'
import { academicDepartmentRouter } from '../modules/academicDepartment/academicDepartment.routes'
import { facultyRouter } from '../modules/faculty/faculty.routes'
import { adminRouter } from '../modules/admin/admin.routes'
import { courseRouter } from '../modules/course/course.routes'
import { semesterRegistrationRouter } from '../modules/semesterRegistration/semesterRegistration.routes'
import { authRouter } from '../modules/auth/auth.routes'
import { offeredCourseRouter } from '../modules/offeredCourse/offeredCourse.routes'
import { enrolledCourseRouter } from '../modules/enrolledCourse/enrolledCourse.routes'

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
  {
    path: '/api/v1/enrolled-course',
    route: enrolledCourseRouter,
  },
  {
    path: '/api/v1/auth',
    route: authRouter,
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
