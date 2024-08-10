/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose'
import { UserModel } from './user.model'
import AppError from '../../errors/AppError'
import httpStatus from 'http-status'
import { TUser } from './user.interface'
import { TStudent } from '../student/student.interface'

import { FacultyModel } from '../faculty/faculty.model'
import { TFaculty } from '../faculty/faculty.interface'
import { StudentModel } from '../student/student.model'
import { TAdmin } from '../admin/admin.interface'
import { AdminModel } from '../admin/admin.model'
import { sendImageToCloudinary } from '../../../utils/sentImageToCloudinary'

const createStudentIntoDb = async (
  file: any,
  userData: Partial<TUser>,
  studentData: TStudent,
) => {
  const session = await mongoose.startSession()

  await session.startTransaction()

  try {
    const imageName = `${userData.id}_${studentData.name.lastName}`

    let imageUrl

    if (file) {
      imageUrl = await sendImageToCloudinary(imageName, file.path)

      studentData.profileImage = imageUrl?.secure_url
    } else {
      imageUrl = ''
    }

    const newUser = await UserModel.create([userData], { session })

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user')
    }

    studentData.id = newUser[0].id
    studentData.user = newUser[0]._id

    // create student record
    const newStudent = await StudentModel.create([studentData], { session })

    if (!newStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student')
    }

    await session.commitTransaction()
    await session.endSession()
    return newStudent[0]
  } catch (err: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(err)
  }
}

const createFacultyIntoDb = async (
  file: any,
  userData: Partial<TUser>,
  facultyData: TFaculty,
) => {
  const session = await mongoose.startSession()

  await session.startTransaction()

  try {
    const imageName = `${userData.id}_${facultyData.name.lastName}`

    const imageUrl = await sendImageToCloudinary(imageName, file.path)

    facultyData.profileImg = imageUrl?.secure_url

    const newUser = await UserModel.create([userData], { session })

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user')
    }

    facultyData.id = newUser[0].id
    facultyData.user = newUser[0]._id

    // create student record
    const newFaculty = await FacultyModel.create([facultyData], { session })

    if (!newFaculty) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Faculty')
    }

    await session.commitTransaction()
    await session.endSession()
    return newFaculty[0]
  } catch (err: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(err)
  }
}
const createAdminIntoDb = async (
  file: any,
  userData: Partial<TUser>,
  adminData: TAdmin,
) => {
  const session = await mongoose.startSession()

  await session.startTransaction()

  try {
    const imageName = `${userData.id}_${adminData.name.lastName}`

    const imageUrl = await sendImageToCloudinary(imageName, file.path)

    adminData.profileImg = imageUrl?.secure_url

    const newUser = await UserModel.create([userData], { session })

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user')
    }

    adminData.id = newUser[0].id
    adminData.user = newUser[0]._id

    // create student record
    const newAdmin = await AdminModel.create([adminData], { session })

    if (!newAdmin) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Admin')
    }

    await session.commitTransaction()
    await session.endSession()
    return newAdmin[0]
  } catch (err: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(err)
  }
}

const getMe = async (user: { userId: string; role: string }) => {
  const { role, userId } = user

  let result: TStudent | TFaculty | TAdmin | null = null

  if (role === 'student') {
    result = await StudentModel.findOne({ id: userId }).populate('user')
  }

  if (role === 'faculty') {
    result = await FacultyModel.findOne({ id: userId }).populate('user')
  }

  if (role === 'admin') {
    result = await AdminModel.findOne({ id: userId }).populate('user')
  }

  return result
}

const changeStatus = async (userId: string, status: { status: string }) => {
  const result = await UserModel.findByIdAndUpdate(
    userId,
    { status: status },
    {
      new: true,
    },
  )

  return result
}

export const userService = {
  createStudentIntoDb,
  createFacultyIntoDb,
  createAdminIntoDb,
  changeStatus,
  getMe,
}
