import { Router } from 'express'
import { offeredCourseController } from './offeredCourse.controller'

import validateRequest from '../../middlewares/validateRequest'
import { offeredCourseValidation } from './offeredCourse.validation'
import auth from './../../middlewares/auth'
import { USER_ROLE } from '../user/user.const'

const router = Router()

router
  .route('/')
  .get(auth(USER_ROLE.admin), offeredCourseController.getOfferedCourses)
  .post(
    validateRequest(offeredCourseValidation.createOfferedCourseSchema),
    offeredCourseController.createOfferedCourse,
  )

router
  .route('/:offeredCourseId')
  .get(offeredCourseController.getOfferedCourseById)
  .patch(
    validateRequest(offeredCourseValidation.updateOfferedCourseSchema),
    offeredCourseController.updateOfferedCourseById,
  )
  .delete(offeredCourseController.deleteOfferedCourseById)

export const offeredCourseRouter = router
