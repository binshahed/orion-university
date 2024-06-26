import { Router } from 'express'
import { academicDepartmentController } from './academicDepartment.controller'
import { academicFacultyValidation } from './academicDepartment.validation'
import validateRequest from '../../middlewares/validateRequest'

const router = Router()

router
  .route('/')
  .get(academicDepartmentController.getAcademicDepartments)
  .post(
    validateRequest(academicFacultyValidation),
    academicDepartmentController.createAcademicDepartment,
  )

router
  .route('/:academicDepartmentId')
  .patch(academicDepartmentController.updateAcademicDepartment)
  .get(academicDepartmentController.getAcademicDepartmentById)

export const academicDepartmentRouter = router
