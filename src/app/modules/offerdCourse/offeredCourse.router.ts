import { Router } from 'express'
import { offeredCourseController } from './offeredCourse.controller'

import validateRequest from '../../middlewares/validateRequest'
import { offeredCourseValidation } from './offeredCourse.validation'

const router = Router()

router
  .route('/')
  .get(offeredCourseController.getOfferedCourses)
  .post(
    validateRequest(offeredCourseValidation.createOfferedCourseSchema),
    offeredCourseController.createOfferedCourse,
  )

router
  .route('/:courseId')
  .get(offeredCourseController.getOfferedCourseById)
  .patch(
    validateRequest(offeredCourseValidation.updateOfferedCourseSchema),
    offeredCourseController.updateOfferedCourseById,
  )
  .delete(offeredCourseController.deleteOfferedCourseById)

export const offeredCourseRouter = router
