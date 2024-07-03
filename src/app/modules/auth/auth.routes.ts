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

router
  .route('/reset-password')
  .post(
    auth(),
    validateRequest(AuthValidation.resetPasswordValidationSchema),
    authController.resetPassword,
  )

router
  .route('/forget-password')
  .post(
    validateRequest(AuthValidation.forgotPasswordValidationSchema),
    authController.forgotPassword,
  )

export const authRouter = router
