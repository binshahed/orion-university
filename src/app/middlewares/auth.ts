import { NextFunction, Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import AppError from '../errors/AppError'
import httpStatus from 'http-status'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../config'
import { TUserRole } from '../modules/user/user.interface'
import { UserModel } from '../modules/user/user.model'

// Middleware for authorization based on user roles
const auth = (...allowedRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization

    // Check if the token is provided by the client
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!')
    }

    // Verify the token and decode the payload
    const decodedToken = jwt.verify(
      token,
      config.jwtAccessSecretKey as string,
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

    // Check if the user's role is allowed
    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!')
    }

    // Attach the decoded token data to the request object
    req.user = decodedToken
    next()
  })
}

export default auth
