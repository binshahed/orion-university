import { Router } from 'express'
import { studentController } from './student.controller'
import validateRequest from '../../middlewares/validateRequest'
import { StudentValidation } from './student.validation'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../user/user.const'

const router = Router()

router
  .route('/')
  .get(auth(USER_ROLE.admin, USER_ROLE.faculty), studentController.getStudents)
router
  .route('/:studentId')
  .get(
    auth(USER_ROLE.admin, USER_ROLE.faculty),
    studentController.getStudentById,
  )
  .patch(
    auth(),
    validateRequest(StudentValidation.UpdateStudentValidationSchema),
    studentController.updateStudentById,
  )
  .delete(studentController.deleteStudentById)

export const StudentRouter = router
