import { Router } from 'express'
import { studentController } from './student.controller'
import validateRequest from '../../middlewares/validateRequest'
import { StudentValidation } from './student.validation'
import auth from '../../middlewares/auth'

const router = Router()

router.route('/').get(studentController.getStudents)
router
  .route('/:studentId')
  .get(studentController.getStudentById)
  .patch(
    auth(),
    validateRequest(StudentValidation.UpdateStudentValidationSchema),
    studentController.updateStudentById,
  )
  .delete(studentController.deleteStudentById)

export const StudentRouter = router
