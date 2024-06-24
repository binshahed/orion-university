import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { UserModel } from '../user/user.model'
import { TUserLogin } from './auth.interface'
import jwt from 'jsonwebtoken'
import config from '../../config'

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
    if (!user || user?.isDeleted) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'This user is blocked')
    }
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

  //   generate token
  const accessToken = jwt.sign(
    {
      data: {
        userId: user.id,
        role: user.role,
      },
    },
    config.jwtSecret as string,
    { expiresIn: '10d' },
  )

  return { accessToken, needPasswordChange: user.needsPasswordChange }
}

export const authService = {
  loginUser,
}
