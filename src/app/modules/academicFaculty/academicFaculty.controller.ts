import httpStatus from 'http-status'
import catchAsync from '../../../utils/catchAsync'
import sendResponse from '../../../utils/sendResponse'
import { TAcademicFaculty } from './academicFaculty.interface'
import { academicFacultyService } from './academicFaculty.service'
import AppError from '../../errors/AppError'

const createAcademicFaculty = catchAsync(async (req, res) => {
  const academicFacultyData: TAcademicFaculty = req.body
  const academicFaculty =
    await academicFacultyService.createAcademicFaculty(academicFacultyData)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty created successfully!',
    data: academicFaculty,
  })
})

const getAcademicFaculties = catchAsync(async (req, res) => {
  const academicFaculties = await academicFacultyService.getAcademicFaculties()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculties fetched successfully!',
    data: academicFaculties,
  })
})

const getAcademicFacultyById = catchAsync(async (req, res) => {
  const academicFacultyId: string = req.params.academicFacultyId
  const academicFaculty =
    await academicFacultyService.getAcademicFacultyById(academicFacultyId)
  if (!academicFaculty) {
    throw new AppError(httpStatus.NOT_FOUND, 'AcademicFaculty not found')
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty fetched successfully!',
    data: academicFaculty,
  })
})

const updateAcademicFaculty = catchAsync(async (req, res) => {
  const academicFacultyId: string = req.params.academicFacultyId
  const academicFacultyData: TAcademicFaculty = req.body

  const academicFaculty = await academicFacultyService.updateAcademicFaculty(
    academicFacultyId,
    academicFacultyData,
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty updated successfully!',
    data: academicFaculty,
  })
})

export const academicFacultyController = {
  createAcademicFaculty,
  getAcademicFaculties,
  getAcademicFacultyById,
  updateAcademicFaculty,
}
