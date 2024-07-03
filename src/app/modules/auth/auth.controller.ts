import httpStatus from 'http-status'
import catchAsync from '../../../utils/catchAsync'
import sendResponse from '../../../utils/sendResponse'
import { authService } from './auth.service'
import config from '../../config'

const loginUser = catchAsync(async (req, res) => {
  const { accessToken, refreshToken, needPasswordChange } =
    await authService.loginUser(req.body)

  res.cookie('refreshToken', refreshToken, {
    secure: config.nodeEnv === 'production',
    httpOnly: true,
  })

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully!',
    data: {
      accessToken,
      needPasswordChange,
    },
  })
})

const changePassword = catchAsync(async (req, res) => {
  const user = await authService.changePassword(req.user, req.body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password changed successfully!',
    data: user,
  })
})

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies

  const result = await authService.refreshToken(refreshToken)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'access token is retrieved successfully!',
    data: result,
  })
})

const forgotPassword = catchAsync(async (req, res) => {
  const result = await authService.forgotPassword(req.body.id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset link sent successfully!',
    data: result,
  })
})

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization
  const user = await authService.resetPassword(req.body, token as string)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password changed successfully!',
    data: user,
  })
})

export const authController = {
  loginUser,
  changePassword,
  refreshToken,
  forgotPassword,
  resetPassword,
}
