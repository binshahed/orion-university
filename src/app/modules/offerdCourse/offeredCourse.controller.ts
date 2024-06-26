import httpStatus from 'http-status'
import catchAsync from '../../../utils/catchAsync'
import sendResponse from '../../../utils/sendResponse'
import { offeredCourseService } from './offeredCourse.service'
import { TOfferedCourse } from './offeredCourse.interface'
import AppError from '../../errors/AppError'

const createOfferedCourse = catchAsync(async (req, res) => {
  const course: TOfferedCourse = req.body

  const result = await offeredCourseService.createOfferedCourse(course)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Offered Course created successfully!',
    data: result,
  })
})

const getOfferedCourses = catchAsync(async (req, res) => {
  const courses = await offeredCourseService.getOfferedCourse(req.query)
  console.log(req.cookies)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Courses fetched successfully!',
    data: courses,
  })
})

const getOfferedCourseById = catchAsync(async (req, res) => {
  const courseId: string = req.params.offeredCourseId
  const course = await offeredCourseService.getOfferedCourseById(courseId)
  if (!course) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course not found')
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course fetched successfully!',
    data: course,
  })
})

const updateOfferedCourseById = catchAsync(async (req, res) => {
  const courseId: string = req.params.offeredCourseId
  const course: Pick<
    TOfferedCourse,
    'faculty' | 'days' | 'startTime' | 'endTime'
  > = req.body
  const updatedCourse = await offeredCourseService.updateOfferedCourseById(
    courseId,
    course,
  )

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course updated successfully!',
    data: updatedCourse,
  })
})

const deleteOfferedCourseById = catchAsync(async (req, res) => {
  const courseId: string = req.params.offeredCourseId
  const course = await offeredCourseService.deleteOfferedCourseById(courseId)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course deleted successfully!',
    data: course,
  })
})

export const offeredCourseController = {
  createOfferedCourse,
  getOfferedCourses,
  getOfferedCourseById,
  updateOfferedCourseById,
  deleteOfferedCourseById,
}
