import { Router } from 'express'
import { userController } from './user.controller'

import { StudentValidation } from '../student/student.validation'
import validateRequest from '../../middlewares/validateRequest'
import { UserValidation } from './user.validation'
import { facultyValidation } from '../faculty/faculty.validation'
import { adminValidation } from '../admin/admin.validation'
import auth from '../../middlewares/auth'
import { USER_ROLE } from './user.const'

const router = Router()

router.post(
  '/create-student',
  auth(USER_ROLE.admin),
  validateRequest(UserValidation.userValidationSchema),
  validateRequest(StudentValidation.studentValidationSchema),
  userController.createUser,
)

router.post(
  '/create-faculty',
  auth(USER_ROLE.admin),
  validateRequest(UserValidation.userValidationSchema),
  validateRequest(facultyValidation.facultyValidationSchema),
  userController.createFaculty,
)
router.post(
  '/create-admin',
  validateRequest(UserValidation.userValidationSchema),
  validateRequest(adminValidation.adminValidationSchema),
  userController.createAdmin,
)

export const userRouter = router
