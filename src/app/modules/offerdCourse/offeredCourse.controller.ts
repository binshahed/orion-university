import httpStatus from 'http-status'
import catchAsync from '../../../utils/catchAsync'
import sendResponse from '../../../utils/sendResponse'
import { courseService } from './offeredCourse.service'
import { TOfferedCourse } from './offeredCourse.interface'
import AppError from '../../errors/AppError'

const createOfferedCourse = catchAsync(async (req, res) => {
  const course: TOfferedCourse = req.body

  const result = await courseService.createOfferedCourse(course)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Course created successfully!',
    data: result,
  })
})

const getOfferedCourses = catchAsync(async (req, res) => {
  const courses = await courseService.getOfferedCourse(req.query)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courses fetched successfully!',
    data: courses,
  })
})

const getOfferedCourseById = catchAsync(async (req, res) => {
  const courseId: string = req.params.courseId
  const course = await courseService.getOfferedCourseById(courseId)
  if (!course) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found')
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course fetched successfully!',
    data: course,
  })
})

const updateOfferedCourseById = catchAsync(async (req, res) => {
  const courseId: string = req.params.courseId
  const course: Partial<TOfferedCourse> = req.body
  const updatedCourse = await courseService.updateOfferedCourseById(
    courseId,
    course,
  )

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course updated successfully!',
    data: updatedCourse,
  })
})

const deleteOfferedCourseById = catchAsync(async (req, res) => {
  const courseId: string = req.params.courseId
  const course = await courseService.deleteOfferedCourseById(courseId)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course deleted successfully!',
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
