/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status'
import { EnrolledCourseModel } from './enrolledCourse.model'
import { TCourseMarks, TEnrolledCourse } from './enrolledCourse.interface'
import mongoose, { Schema } from 'mongoose'
import { SemesterRegistrationModel } from '../semesterRegistration/semesterRegistration.model'
import { CourseModel } from '../course/course.model'
import AppError from '../../errors/AppError'
import {
  calculateGradeAndPoints,
  calculateTotalCredits,
  checkCreditLimit,
  checkEnrollmentConflict,
  findOfferedCourseById,
  findStudentById,
} from './enrolledCourse.utils'
import { FacultyModel } from '../faculty/faculty.model'
import { StudentModel } from '../student/student.model'

const createEnrolledCourse = async (
  userId: string,
  payload: TEnrolledCourse,
) => {
  const { offeredCourse: offeredCourseId } = payload

  // Find the student and offered course
  const student = await findStudentById(userId)
  const offeredCourse = await findOfferedCourseById(offeredCourseId)

  // Check if the offered course has reached its maximum capacity
  if (offeredCourse.maxCapacity <= 0) {
    throw new AppError(httpStatus.BAD_GATEWAY, 'Course is at full capacity')
  }

  // Check for enrollment conflict
  await checkEnrollmentConflict(
    student._id as unknown as Schema.Types.ObjectId,
    offeredCourse._id as unknown as Schema.Types.ObjectId,
    offeredCourse.semesterRegistration as unknown as Schema.Types.ObjectId,
  )

  // Get the maximum credit limit for the semester
  const semesterRegistration = await SemesterRegistrationModel.findById(
    offeredCourse.semesterRegistration,
  ).select('maxCredit')
  if (!semesterRegistration) {
    throw new AppError(httpStatus.NOT_FOUND, 'Semester registration not found')
  }

  // Calculate total enrolled credits
  const totalEnrolledCredits = await calculateTotalCredits(
    student._id as unknown as Schema.Types.ObjectId,
    offeredCourse.semesterRegistration as unknown as Schema.Types.ObjectId,
  )

  // Find the course to be enrolled
  const course = await CourseModel.findById(offeredCourse.course).select(
    'credits',
  )
  if (!course) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found')
  }

  // Check if enrolling in the new course would exceed the student's credit limit
  await checkCreditLimit(
    totalEnrolledCredits,
    course.credits,
    semesterRegistration.maxCredit,
  )

  // Set the payload fields
  payload.semesterRegistration =
    offeredCourse.semesterRegistration as unknown as Schema.Types.ObjectId
  payload.academicSemester =
    offeredCourse.academicSemester as unknown as Schema.Types.ObjectId
  payload.academicFaculty =
    offeredCourse.academicFaculty as unknown as Schema.Types.ObjectId
  payload.academicDepartment =
    offeredCourse.academicDepartment as unknown as Schema.Types.ObjectId
  payload.course = offeredCourse.course as unknown as Schema.Types.ObjectId
  payload.student = student._id as unknown as Schema.Types.ObjectId
  payload.faculty = offeredCourse.faculty as unknown as Schema.Types.ObjectId
  payload.isEnrolled = true

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    // Create the enrolled course
    const newEnrolledCourse = await EnrolledCourseModel.create([payload], {
      session,
    })

    // Decrement the offered course's max capacity
    offeredCourse.maxCapacity -= 1
    await offeredCourse.save({ session })

    await session.commitTransaction()

    if (!newEnrolledCourse) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to enroll in the course',
      )
    }

    return newEnrolledCourse[0]
  } catch (err: any) {
    await session.abortTransaction()
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, err.message)
  } finally {
    session.endSession()
  }
}

const updateEnrolledCourse = async (
  facultyId: string,
  payload: Partial<TEnrolledCourse>,
) => {
  const {
    semesterRegistration: semesterRegistrationId,
    offeredCourse: offeredCourseId,
    student: studentId,
    courseMarks,
  } = payload

  const offeredCourse = await findOfferedCourseById(
    offeredCourseId as unknown as Schema.Types.ObjectId,
  )

  // Get the maximum credit limit for the semester
  const semesterRegistration = await SemesterRegistrationModel.findById(
    semesterRegistrationId,
    { _id: 1 },
  )
  if (!semesterRegistration) {
    throw new AppError(httpStatus.NOT_FOUND, 'Semester registration not found')
  }

  const student = await StudentModel.findById(studentId, { _id: studentId })

  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found')
  }

  const faculty = await FacultyModel.findOne(
    {
      id: facultyId,
    },
    {
      _id: 1,
    },
  )

  if (!faculty) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty Not Found')
  }

  const isCourseBelongToFaculty = await EnrolledCourseModel.findOne({
    semesterRegistration,
    offeredCourse,
    student,
    faculty: faculty._id,
  })

  const modifiedData: Record<string, unknown> = {
    ...courseMarks,
  }

  if (courseMarks?.finalTerm) {
    const { classTest1, midTerm, classTest2, finalTerm } =
      isCourseBelongToFaculty?.courseMarks as TCourseMarks

    const totalMarks =
      Math.ceil(classTest1 * 0.1) +
      Math.ceil(midTerm * 0.3) +
      Math.ceil(classTest2 * 0.1) +
      Math.ceil(finalTerm * 0.5)
    console.log(totalMarks)
    const calculatePoint = calculateGradeAndPoints(totalMarks)
    modifiedData.grad = calculatePoint.grade
    modifiedData.gradPoint = calculatePoint.points
    modifiedData.isCompleted = true
  }

  if (courseMarks && Object.keys(courseMarks).length) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value
    }
  }

  console.log(modifiedData)

  const result = await EnrolledCourseModel.findByIdAndUpdate(
    isCourseBelongToFaculty?._id,
    modifiedData,
    {
      new: true,
    },
  )

  return result
}

export const enrolledCourseService = {
  createEnrolledCourse,
  updateEnrolledCourse,
}
