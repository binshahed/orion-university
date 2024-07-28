import { NextFunction, Request, Response, Router } from 'express'
import { userController } from './user.controller'

import { StudentValidation } from '../student/student.validation'
import validateRequest from '../../middlewares/validateRequest'
import { UserValidation } from './user.validation'
import { facultyValidation } from '../faculty/faculty.validation'
import { adminValidation } from '../admin/admin.validation'
import auth from '../../middlewares/auth'
import { USER_ROLE } from './user.const'
import { upload } from '../../../utils/sentImageToCloudinary'

const router = Router()

router.post(
  '/create-student',
  auth(USER_ROLE.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data)
    next()
  },
  validateRequest(StudentValidation.studentValidationSchema),
  userController.createStudent,
)

router.post(
  '/create-faculty',
  auth(USER_ROLE.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data)
    next()
  },
  validateRequest(UserValidation.userValidationSchema),
  validateRequest(facultyValidation.facultyValidationSchema),
  userController.createFaculty,
)
router.post(
  '/create-admin',
  // auth(USER_ROLE.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data)
    next()
  },
  validateRequest(UserValidation.userValidationSchema),
  validateRequest(adminValidation.adminValidationSchema),
  userController.createAdmin,
)

router.post(
  '/change-status/:id',
  auth(USER_ROLE.admin),
  validateRequest(UserValidation.changeStatusValidationSchema),
  userController.changeStatus,
)

router.get(
  '/me',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  userController.getMe,
)

export const userRouter = router
