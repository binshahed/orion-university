/* eslint-disable @typescript-eslint/no-explicit-any */
import { studentService } from './student.service';
import { StudentValidation } from './student.validation';
import sendResponse from '../../../utils/sendResponse';
import catchAsync from '../../../utils/catchAsync';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

const getStudents = catchAsync(async (req, res) => {
  const students = await studentService.getStudents();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Students fetched successfully!',
    data: students,
  });
});

const getStudentById = catchAsync(async (req, res) => {
  const student = await studentService.getStudentById(req.params.studentId);
  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student Not Found');
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student fetched successfully!',
    data: student,
  });
});

const updateStudentById = catchAsync(async (req, res) => {
  const studentId: string = req.params.studentId;
  const studentData = req.body;

  // Validate the partial data with strict validation

  const validateData: any =
    StudentValidation.PartialStudentValidationSchema.parse(studentData);

  // update Student by id
  const student = await studentService.updateStudentById(
    studentId,
    validateData,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student updated successfully!',
    data: student,
  });
});

const deleteStudentById = catchAsync(async (req, res) => {
  const studentId = req.params.studentId;
  const student = await studentService.deleteStudentById(studentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student deleted successfully!',
    data: student,
  });
});

export const studentController = {
  getStudents,
  getStudentById,
  updateStudentById,
  deleteStudentById,
};
