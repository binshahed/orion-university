import { Router } from 'express'
import { academicSemesterController } from './academicSemester.controller'
import validateRequest from '../../middlewares/validateRequest'
import { academicSemesterValidation } from './academicSemester.validation'

const router = Router()

router
  .route('/')
  .get(academicSemesterController.getAcademicSemester)
  .post(
    validateRequest(academicSemesterValidation.createSemesterValidation),
    academicSemesterController.createAcademicSemester,
  )

router
  .route('/:semesterId')
  .patch(
    validateRequest(academicSemesterValidation.updateSemesterValidation),
    academicSemesterController.updateAcademicSemesterById,
  )
  .get(academicSemesterController.getAcademicSemesterById)

export const academicSemesterRouter = router
