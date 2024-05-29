import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { TAcademicDepartment } from './academicDepartment.interface';
import { academicDepartmentService } from './academicDepartment.service';
import AppError from '../../errors/AppError';

const createAcademicDepartment = catchAsync(async (req, res) => {
  const academicDepartmentData: TAcademicDepartment = req.body;
  const academicDepartment =
    await academicDepartmentService.createAcademicDepartment(
      academicDepartmentData,
    );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department created successfully!',
    data: academicDepartment,
  });
});

const getAcademicDepartments = catchAsync(async (req, res) => {
  const academicFaculties =
    await academicDepartmentService.getAcademicDepartments();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculties fetched successfully!',
    data: academicFaculties,
  });
});

const getAcademicDepartmentById = catchAsync(async (req, res) => {
  const academicDepartmentId: string = req.params.academicDepartmentId;
  const academicDepartment =
    await academicDepartmentService.getAcademicDepartmentById(
      academicDepartmentId,
    );
  if (!academicDepartment) {
    throw new AppError(httpStatus.NOT_FOUND, 'AcademicDepartment not found');
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department fetched successfully!',
    data: academicDepartment,
  });
});

const updateAcademicDepartment = catchAsync(async (req, res) => {
  const academicDepartmentId: string = req.params.academicDepartmentId;
  const academicDepartmentData: TAcademicDepartment = req.body;

  const academicDepartment =
    await academicDepartmentService.updateAcademicDepartment(
      academicDepartmentId,
      academicDepartmentData,
    );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department updated successfully!',
    data: academicDepartment,
  });
});

export const academicDepartmentController = {
  createAcademicDepartment,
  getAcademicDepartments,
  getAcademicDepartmentById,
  updateAcademicDepartment,
};
