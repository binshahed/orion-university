import { userService } from './user.service';
import { TUser } from './user.interface';
import config from '../../config';
import catchAsync from '../../../utils/catchAsync';
import { academicSemesterService } from '../academicSemester/academicSemester.service';
import { generateStudentId } from './user.utils';
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

  user.id = await generateStudentId(academicSemester);

  // create new user
  const newStudent = await userService.createUser(user, studentData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student created successfully',
    data: newStudent,
  });
});

export const userController = {
  createUser,
};
