import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { academicSemesterService } from './academicSemester.service';

const createAcademicSemester = catchAsync(async (req, res) => {
  const academicSemester = await academicSemesterService.createAcademicSemester(
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester created successfully!',
    data: academicSemester,
  });
});
const getAcademicSemester = catchAsync(async (req, res) => {
  const academicSemester = await academicSemesterService.getAcademicSemester();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester fetched successfully!',
    data: academicSemester,
  });
});
const getAcademicSemesterById = catchAsync(async (req, res) => {
  const academicSemester =
    await academicSemesterService.getAcademicSemesterById(
      req.params.semesterId,
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester fetched successfully!',
    data: academicSemester,
  });
});

const updateAcademicSemesterById = catchAsync(async (req, res) => {
  const academicSemester =
    await academicSemesterService.updateAcademicSemesterById(
      req.params.semesterId,
      req.body,
    );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester updated successfully!',
    data: academicSemester,
  });
});

export const academicSemesterController = {
  createAcademicSemester,
  getAcademicSemester,
  getAcademicSemesterById,
  updateAcademicSemesterById,
};
