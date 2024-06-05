import { userService } from './user.service';
import { TUser } from './user.interface';
import config from '../../config';
import catchAsync from '../../../utils/catchAsync';
import { academicSemesterService } from '../academicSemester/academicSemester.service';
import { generateFacultyId, generateStudentId } from './user.utils';
import httpStatus from 'http-status';
import sendResponse from '../../../utils/sendResponse';
import { academicDepartmentService } from '../academicDepartment/academicDepartment.service';
import AppError from '../../errors/AppError';

export const createUser = catchAsync(async (req, res) => {
  const { password, studentData } = req.body;

  const user: Partial<TUser> = {};

  // if password not given use default password
  user.password = password || config.defaultPassword;
  user.role = 'student';

  // check academicDepartment exists
  const academicDepartment =
    await academicDepartmentService.getAcademicDepartmentById(
      studentData.academicDepartment,
    );
  if (!academicDepartment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic department not found');
  }

  // check is academic semester exist
  const academicSemester =
    await academicSemesterService.getAcademicSemesterById(
      studentData.admissionSemester,
    );

  if (!academicSemester) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic semester not found');
  }

  // user.id = '2025020004';
  user.id = await generateStudentId(academicSemester);

  // create new user
  const newStudent = await userService.createStudentIntoDb(user, studentData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student created successfully',
    data: newStudent,
  });
});

const createFaculty = catchAsync(async (req, res) => {
  const { password, facultyData } = req.body;

  const user: Partial<TUser> = {};

  // if password not given use default password
  user.password = password || config.defaultPassword;
  user.role = 'faculty';

  // check academicDepartment exists
  const academicDepartment =
    await academicDepartmentService.getAcademicDepartmentById(
      facultyData.academicDepartment,
    );
  if (!academicDepartment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic department not found');
  }

  user.id = await generateFacultyId();

  const newFaculty = await userService.createFacultyIntoDb(user, facultyData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty created successfully',
    data: newFaculty,
  });
});

export const userController = {
  createUser,
  createFaculty,
};
