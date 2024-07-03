import { userService } from './user.service'
import { TUser } from './user.interface'
import config from '../../config'
import catchAsync from '../../../utils/catchAsync'
import { academicSemesterService } from '../academicSemester/academicSemester.service'
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils'
import httpStatus from 'http-status'
import sendResponse from '../../../utils/sendResponse'
import { academicDepartmentService } from '../academicDepartment/academicDepartment.service'
import AppError from '../../errors/AppError'

export const createStudent = catchAsync(async (req, res) => {
  const { password, studentData } = req.body

  const user: Partial<TUser> = {}

  // if password not given use default password
  user.password = password || config.defaultPassword
  user.role = 'student'
  user.email = studentData.email

  // check academicDepartment exists
  const academicDepartment =
    await academicDepartmentService.getAcademicDepartmentById(
      studentData.academicDepartment,
    )
  if (!academicDepartment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic department not found')
  }

  // check is academic semester exist
  const academicSemester =
    await academicSemesterService.getAcademicSemesterById(
      studentData.admissionSemester,
    )

  if (!academicSemester) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic semester not found')
  }

  // user.id = '2025020004';
  user.id = await generateStudentId(academicSemester)

  // create new user
  const newStudent = await userService.createStudentIntoDb(user, studentData)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User registered successfully',
    data: newStudent,
  })
})

const createFaculty = catchAsync(async (req, res) => {
  const { password, facultyData } = req.body

  const user: Partial<TUser> = {}

  // if password not given use default password
  user.password = password || config.defaultPassword
  user.role = 'faculty'
  user.email = facultyData.email

  // check academicDepartment exists
  const academicDepartment =
    await academicDepartmentService.getAcademicDepartmentById(
      facultyData.academicDepartment,
    )
  if (!academicDepartment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic department not found')
  }

  user.id = await generateFacultyId()

  const newFaculty = await userService.createFacultyIntoDb(user, facultyData)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty created successfully',
    data: newFaculty,
  })
})
const createAdmin = catchAsync(async (req, res) => {
  const { password, adminData } = req.body

  const user: Partial<TUser> = {}

  // if password not given use default password
  user.password = password || config.defaultPassword
  user.role = 'admin'
  user.email = adminData.email

  // check academicDepartment exists
  // const academicDepartment =
  //   await academicDepartmentService.getAcademicDepartmentById(
  //     facultyData.academicDepartment,
  //   );
  // if (!academicDepartment) {
  //   throw new AppError(httpStatus.NOT_FOUND, 'Academic department not found');
  // }

  user.id = await generateAdminId()

  const newAdmin = await userService.createAdminIntoDb(user, adminData)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin created successfully',
    data: newAdmin,
  })
})

export const userController = {
  createStudent,
  createFaculty,
  createAdmin,
}
