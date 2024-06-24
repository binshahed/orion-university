import { Router } from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { AuthValidation } from './auth.validation'
import { authController } from './auth.controller'

const router = Router()

router
  .route('/')
  .post(
    validateRequest(AuthValidation.loginValidationSchema),
    authController.loginUser,
  )

export const authRouter = router
