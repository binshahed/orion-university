import { userService } from './user.service';
import { TUser } from './user.interface';
import config from '../../config';

import { studentService } from '../student/student.service';
import catchAsync from '../../../utils/catchAsync';
import { academicSemesterService } from '../academicSemester/academicSemester.service';
import { generateStudentId } from './user.utils';

export const createUser = catchAsync(async (req, res) => {
  const { password, studentData } = req.body;

  const user: Partial<TUser> = {};

  // if password not given use default password
  user.password = password || config.defaultPassword;
  user.role = 'student';

  // check is academic semester exist
  const academicSemester =
    await academicSemesterService.getAcademicSemesterById(
      studentData.admissionSemester,
    );

  if (!academicSemester) {
    throw new Error('Academic semester not found');
  }

  user.id = await generateStudentId(academicSemester);

  // create new user
  const newUser = await userService.createUser(user);

  if (Object.keys(newUser).length) {
    studentData.id = newUser.id;
    studentData.user = newUser._id.toString();
  }

  // create student record
  const newStudent = await studentService.createStudent(studentData);

  res.status(201).send({
    success: true,
    message: 'Student created successfully',
    data: newStudent,
  });
});

export const userController = {
  createUser,
};
