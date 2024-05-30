/* eslint-disable @typescript-eslint/no-explicit-any */
import { studentService } from './student.service';
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

  // update Student by id
  const student = await studentService.updateStudentById(
    studentId,
    studentData,
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
  const result = await studentService.deleteStudentById(studentId);

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Student not found');
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student deleted successfully!',
    data: result,
  });
});

export const studentController = {
  getStudents,
  getStudentById,
  updateStudentById,
  deleteStudentById,
};
