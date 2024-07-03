import { Router } from 'express'
import { academicFacultyController } from './academicFaculty.controller'
import { academicFacultyValidation } from './academicFaculty.validation'
import validateRequest from '../../middlewares/validateRequest'

const router = Router()

router
  .route('/')
  .get(academicFacultyController.getAcademicFaculties)
  .post(
    validateRequest(academicFacultyValidation),
    academicFacultyController.createAcademicFaculty,
  )

router
  .route('/:academicFacultyId')
  .patch(academicFacultyController.updateAcademicFaculty)
  .get(academicFacultyController.getAcademicFacultyById)

export const academicFacultyRouter = router
