import { Router } from 'express'
import { courseController } from './course.controller'
import {
  createCourseSchemaValidation,
  facultiesWithCourseValidationSchema,
  updateCourseSchemaValidation,
} from './course.validation'
import validateRequest from '../../middlewares/validateRequest'

const router = Router()

router
  .route('/')
  .get(courseController.getCourses)
  .post(
    validateRequest(createCourseSchemaValidation),
    courseController.createCourse,
  )

router
  .route('/:courseId')
  .get(courseController.getCourseById)
  .patch(
    validateRequest(updateCourseSchemaValidation),
    courseController.updateCourseById,
  )
  .delete(courseController.deleteCourseById)

router
  .route('/:courseId/assign-faculties')
  .put(
    validateRequest(facultiesWithCourseValidationSchema),
    courseController.assignFacultiesWithCourse,
  )
router
  .route('/:courseId/remove-faculties')
  .delete(
    validateRequest(facultiesWithCourseValidationSchema),
    courseController.removeFacultiesFromCourse,
  )

export const courseRouter = router
