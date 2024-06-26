/* eslint-disable no-unused-vars */
import { Model } from 'mongoose'
import { USER_ROLE } from './user.const'

export interface TUser {
  id: string
  password?: string | undefined
  passwordChangeAt?: Date
  needsPasswordChange?: boolean
  role?: 'student' | 'faculty' | 'admin'
  status?: 'in-progress' | 'blocked'
  isDeleted?: boolean
}

export type TNewUser = {
  password: string
  role: string
  id: string
}

export interface TUserModel extends Model<TUser> {
  isUserExistsByCustomId(id: string): Promise<TUser>
  isPasswordMatched(
    textPassword: string,
    hashedPassword: string,
  ): Promise<boolean>
  isJwtIssuedBeforePasswordChanged(
    passwordChangeTime: Date,
    jwtIssuedTimeStamp: number,
  ): boolean
}

export type TUserRole = keyof typeof USER_ROLE
