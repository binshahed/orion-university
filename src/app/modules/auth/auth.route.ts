import { Router } from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { AuthValidation } from './auth.validation'
import { authController } from './auth.controller'
import auth from '../../middlewares/auth'

const router = Router()

router
  .route('/login')
  .post(
    validateRequest(AuthValidation.loginValidationSchema),
    authController.loginUser,
  )

router
  .route('/change-password')
  .post(
    auth(),
    validateRequest(AuthValidation.changePasswordValidationSchema),
    authController.changePassword,
  )

router
  .route('/refresh-token')
  .post(
    validateRequest(AuthValidation.refreshTokenValidationSchema),
    authController.refreshToken,
  )

export const authRouter = router
