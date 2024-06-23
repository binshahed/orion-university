import httpStatus from 'http-status'
import catchAsync from '../../../utils/catchAsync'
import sendResponse from '../../../utils/sendResponse'
import { semesterRegistrationService } from './semesterRegistration.service'

const createSemesterRegistration = catchAsync(async (req, res) => {
  const semesterRegistration =
    await semesterRegistrationService.createSemesterRegistration(req.body)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester Registration created successfully!',
    data: semesterRegistration,
  })
})
const getSemesterRegistration = catchAsync(async (req, res) => {
  const semesterRegistration =
    await semesterRegistrationService.getSemesterRegistration(req.query)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester Registration fetched successfully!',
    data: semesterRegistration,
  })
})
const getSemesterRegistrationById = catchAsync(async (req, res) => {
  const semesterRegistration =
    await semesterRegistrationService.getSemesterRegistrationById(
      req.params.semesterId,
    )

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester Registration fetched successfully!',
    data: semesterRegistration,
  })
})

const updateSemesterRegistrationById = catchAsync(async (req, res) => {
  const semesterRegistration =
    await semesterRegistrationService.updateSemesterRegistrationById(
      req.params.semesterId,
      req.body,
    )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester Registration updated successfully!',
    data: semesterRegistration,
  })
})

export const semesterRegistrationController = {
  createSemesterRegistration,
  getSemesterRegistration,
  getSemesterRegistrationById,
  updateSemesterRegistrationById,
}
