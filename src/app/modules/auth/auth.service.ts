import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { UserModel } from '../user/user.model'
import { TPasswordChange, TUserLogin } from './auth.interface'

import config from '../../config'
import bcrypt from 'bcrypt'
import { createToken } from './auth.utils'
import jwt, { JwtPayload } from 'jsonwebtoken'

const loginUser = async (payload: TUserLogin) => {
  // check if user exists

  const user = await UserModel.isUserExistsByCustomId(payload.id)

  if (!user) {
    throw new AppError(httpStatus.FORBIDDEN, 'User id or password not matched')
  }
  // check if user is deleted
  if (user.isDeleted) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'This User has already been deleted',
    )
  }
  // check if user blocked
  if (user?.status === 'blocked') {
    throw new AppError(httpStatus.UNAUTHORIZED, 'This user is blocked')
  }

  // check if password is incorrect
  if (
    !(await UserModel.isPasswordMatched(
      payload.password,
      user.password as string,
    ))
  ) {
    throw new AppError(httpStatus.FORBIDDEN, 'User id or password not matched')
  }

  // Ensure jwtSecret is defined

  //   generate access token
  const accessToken = createToken(
    {
      userId: user.id,
      role: user.role as string,
    },
    config.jwtAccessSecretKey as string,
    config.jwtAccessExpiresIn as string,
  )

  //   generate refresh token
  const refreshToken = createToken(
    {
      userId: user.id,
      role: user.role as string,
    },
    config.jwtRefreshSecretKey as string,
    config.jwtRefreshExpiresIn as string,
  )

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needsPasswordChange,
  }
}

const changePassword = async (user: JwtPayload, payload: TPasswordChange) => {
  // check if old password is correct

  const userId = user.data.userId
  const userRole = user.data.role

  const fullUserData = await UserModel.isUserExistsByCustomId(userId)

  // check if user is deleted
  if (fullUserData.isDeleted) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'This User has already been deleted',
    )
  }
  // check if user blocked
  if (fullUserData?.status === 'blocked') {
    throw new AppError(httpStatus.UNAUTHORIZED, 'This user is blocked')
  }

  const isPasswordCorrect = await UserModel.isPasswordMatched(
    payload.oldPassword,
    fullUserData.password as string,
  )

  if (!isPasswordCorrect) {
    throw new AppError(httpStatus.FORBIDDEN, 'Old password is incorrect')
  }

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.saltRound),
  )

  await UserModel.findOneAndUpdate(
    { id: userId, role: userRole },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangeAt: new Date(),
    },
    { upsert: true },
  )

  return null
}

const refreshToken = async (token: string) => {
  // Check if the token is provided by the client

  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!')
  }

  // Verify the access token and decode the payload
  const decodedToken = jwt.verify(
    token,
    config.jwtRefreshSecretKey as string,
  ) as JwtPayload
  const { role, userId } = decodedToken.data
  const { iat } = decodedToken

  // Fetch the user's full data using the userId from the token
  const user = await UserModel.isUserExistsByCustomId(userId)

  // check if the user is exist
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'The user does not exist')
  }

  // Check if the user has been deleted
  if (user.isDeleted) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'This user has already been deleted',
    )
  }

  // Check if the user is blocked
  if (user.status === 'blocked') {
    throw new AppError(httpStatus.UNAUTHORIZED, 'This user is blocked')
  }

  // check if password change invalidated token
  if (
    user.passwordChangeAt &&
    UserModel.isJwtIssuedBeforePasswordChanged(
      user.passwordChangeAt,
      iat as number,
    )
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'This user is unauthorized!')
  }

  //   generate access token
  const accessToken = createToken(
    {
      userId: userId,
      role: role,
    },
    config.jwtAccessSecretKey as string,
    config.jwtAccessExpiresIn as string,
  )

  return {
    accessToken,
  }
}

export const authService = {
  loginUser,
  changePassword,
  refreshToken,
}
