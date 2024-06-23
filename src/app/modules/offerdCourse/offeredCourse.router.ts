import { Router } from 'express'
import { offeredCourseController } from './offeredCourse.controller'

import validateRequest from '../../middlewares/validateRequest'
import { offeredCourseValidation } from './offeredCourse.validation'

const router = Router()

router
  .route('/')
  .get(offeredCourseController.getCourses)
  .post(
    validateRequest(offeredCourseValidation.createOfferedCourseSchema),
    offeredCourseController.createCourse,
  )

router
  .route('/:courseId')
  .get(offeredCourseController.getCourseById)
  .patch(
    validateRequest(offeredCourseValidation.updateOfferedCourseSchema),
    offeredCourseController.updateCourseById,
  )
  .delete(offeredCourseController.deleteCourseById)

export const offeredCourseRouter = router
