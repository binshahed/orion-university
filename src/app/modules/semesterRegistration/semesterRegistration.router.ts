import { Router } from 'express'
import { semesterRegistrationController } from './semesterRegistration.controller'
import validateRequest from '../../middlewares/validateRequest'
import { semesterRegistrationValidation } from './semesterRegistration.validation'

const router = Router()

router
  .route('/')
  .get(semesterRegistrationController.getSemesterRegistration)
  .post(
    validateRequest(
      semesterRegistrationValidation.createSemesterRegistrationSchema,
    ),
    semesterRegistrationController.createSemesterRegistration,
  )

router
  .route('/:semesterId')
  .patch(
    validateRequest(
      semesterRegistrationValidation.updateSemesterRegistrationSchema,
    ),
    semesterRegistrationController.updateSemesterRegistrationById,
  )
  .get(semesterRegistrationController.getSemesterRegistrationById)

export const semesterRegistrationRouter = router
