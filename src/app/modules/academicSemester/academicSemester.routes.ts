import { Router } from 'express'
import { academicSemesterController } from './academicSemester.controller'
import validateRequest from '../../middlewares/validateRequest'
import { academicSemesterValidation } from './academicSemester.validation'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../user/user.const'

const router = Router()

router
  .route('/')
  .get(auth(USER_ROLE.admin), academicSemesterController.getAcademicSemester)
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
  .get(
    auth(USER_ROLE.admin),
    academicSemesterController.getAcademicSemesterById,
  )

export const academicSemesterRouter = router
