import httpStatus from 'http-status'
import catchAsync from '../../../utils/catchAsync'
import sendResponse from '../../../utils/sendResponse'
import { courseService } from './course.service'
import { TCourse } from './course.interface'
import AppError from '../../errors/AppError'

const createCourse = catchAsync(async (req, res) => {
  const course: TCourse = req.body

  const newCourse = await courseService.createCourse(course)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Course created successfully!',
    data: newCourse,
  })
})

const getCourses = catchAsync(async (req, res) => {
  const courses = await courseService.getCourses(req.query)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courses fetched successfully!',
    data: courses,
  })
})

const getCourseById = catchAsync(async (req, res) => {
  const courseId: string = req.params.courseId
  const course = await courseService.getCourseById(courseId)
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

const updateCourseById = catchAsync(async (req, res) => {
  const courseId: string = req.params.courseId
  const course: Partial<TCourse> = req.body
  const updatedCourse = await courseService.updateCourseById(courseId, course)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course updated successfully!',
    data: updatedCourse,
  })
})

const deleteCourseById = catchAsync(async (req, res) => {
  const courseId: string = req.params.courseId
  const course = await courseService.deleteCourseById(courseId)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course deleted successfully!',
    data: course,
  })
})

export const courseController = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourseById,
  deleteCourseById,
}
