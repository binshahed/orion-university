/* eslint-disable no-unused-vars */
import { Model } from 'mongoose'

export interface TUser {
  id: string
  password?: string | undefined
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
}
