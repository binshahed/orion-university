import httpStatus from 'http-status'
import catchAsync from '../../../utils/catchAsync'
import sendResponse from '../../../utils/sendResponse'
import { facultyService } from './faculty.service'
import AppError from '../../errors/AppError'

const getFaculties = catchAsync(async (req, res) => {
  const faculties = await facultyService.getFaculties(req.query)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties fetched successfully!',
    data: faculties,
  })
})

const getFacultyById = catchAsync(async (req, res) => {
  const facultyId: string = req.params.facultyId
  const faculty = await facultyService.getFacultyById(facultyId)

  if (!faculty) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found')
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty fetched successfully!',
    data: faculty,
  })
})

const updateFacultyById = catchAsync(async (req, res) => {
  const facultyId: string = req.params.facultyId
  const facultyData = req.body

  // Validate the partial data with strict validation

  // update Student by id
  const faculty = await facultyService.updateFacultyById(facultyId, facultyData)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty updated successfully!',
    data: faculty,
  })
})

const deleteFacultyById = catchAsync(async (req, res) => {
  const facultyId: string = req.params.facultyId
  const faculty = await facultyService.deleteFacultyById(facultyId)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty deleted successfully!',
    data: faculty,
  })
})

export const facultyController = {
  getFaculties,
  getFacultyById,
  updateFacultyById,
  deleteFacultyById,
}
