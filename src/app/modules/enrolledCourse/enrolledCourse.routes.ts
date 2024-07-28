import { Router } from 'express'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../user/user.const'
import validateRequest from '../../middlewares/validateRequest'
import { EnrolledCourseValidation } from './enrolledCourse.validation'
import { enrolledCourseController } from './enrolledCourse.controller'

const router = Router()

router
  .route('/')
  .post(
    auth(USER_ROLE.student),
    validateRequest(
      EnrolledCourseValidation.createEnrolledCourseValidationSchema,
    ),
    enrolledCourseController.createEnrolledCourse,
  )

export const enrolledCourseRouter = router
