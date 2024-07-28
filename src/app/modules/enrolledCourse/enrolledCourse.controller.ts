import catchAsync from '../../../utils/catchAsync'
import sendResponse from '../../../utils/sendResponse'
import { enrolledCourseService } from './enrolledCourse.service'

const createEnrolledCourse = catchAsync(async (req, res) => {
  const userId = req.user.data.userId

  const result = await enrolledCourseService.createEnrolledCourse(
    userId,
    req.body,
  )

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Enrolled course created successfully!',
    data: result,
  })
})

export const enrolledCourseController = {
  createEnrolledCourse,
}
