import { Router } from 'express'
import { courseController } from './course.controller'
import {
  createCourseSchemaValidation,
  facultiesWithCourseValidationSchema,
  updateCourseSchemaValidation,
} from './course.validation'
import validateRequest from '../../middlewares/validateRequest'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../user/user.const'

const router = Router()

router
  .route('/')
  .get(
    auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    courseController.getCourses,
  )
  .post(
    auth(USER_ROLE.admin),
    validateRequest(createCourseSchemaValidation),
    courseController.createCourse,
  )

router
  .route('/:courseId')
  .get(
    auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    courseController.getCourseById,
  )
  .patch(
    auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    validateRequest(updateCourseSchemaValidation),
    courseController.updateCourseById,
  )
  .delete(courseController.deleteCourseById)

router
  .route('/:courseId/assign-faculties')
  .put(
    auth(USER_ROLE.admin),
    validateRequest(facultiesWithCourseValidationSchema),
    courseController.assignFacultiesWithCourse,
  )
router
  .route('/:courseId/remove-faculties')
  .delete(
    auth(USER_ROLE.admin),
    validateRequest(facultiesWithCourseValidationSchema),
    courseController.removeFacultiesFromCourse,
  )

export const courseRouter = router
