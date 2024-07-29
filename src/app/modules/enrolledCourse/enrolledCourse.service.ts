/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { OfferedCourseModel } from '../offeredCourse/offeredCourse.model'
import { StudentModel } from '../student/student.model'
import { EnrolledCourseModel } from './enrolledCourse.model'
import { TEnrolledCourse } from './enrolledCourse.interface'
import mongoose, { Schema } from 'mongoose'
import { SemesterRegistrationModel } from '../semesterRegistration/semesterRegistration.model'

const createEnrolledCourse = async (
  userId: string,
  payload: TEnrolledCourse,
) => {
  // check if course is already enrolled in the semester

  const { offeredCourse: offeredCourseId } = payload
  const student = await StudentModel.findOne({ id: userId }, { _id: 1 })

  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found')
  }

  const offeredCourse = await OfferedCourseModel.findById(offeredCourseId)
  if (!offeredCourse) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course not found')
  }

  if (offeredCourse.maxCapacity <= 0) {
    throw new AppError(httpStatus.BAD_GATEWAY, 'Room is Full!')
  }
  const semesterRegistration = await SemesterRegistrationModel.findById(
    offeredCourse.semesterRegistration,
  ).select('maxCredit')

  console.log(semesterRegistration)

  const enrolledCourse = await EnrolledCourseModel.aggregate([
    {
      $match: {
        semesterRegistration: offeredCourse.semesterRegistration,
        student: student._id,
      },
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
      },
    },
  ])
  console.log(enrolledCourse)

  const isStudentEnrolled = await EnrolledCourseModel.findOne({
    semesterRegistration: offeredCourse.semesterRegistration,
    offeredCourse: offeredCourseId,
    student: student._id,
  })

  if (isStudentEnrolled) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Student is already enrolled in the course',
    )
  }

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

  await session.startTransaction()

  try {
    const newEnrolledCourse = await EnrolledCourseModel.create([payload], {
      session,
    })

    offeredCourse.maxCapacity -= 1
    await offeredCourse.save({ session })

    await session.commitTransaction()
    await session.endSession()

    if (!newEnrolledCourse) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Something went wrong!')
    }

    return newEnrolledCourse[0]
  } catch (err: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(err)
  }
}

export const enrolledCourseService = {
  createEnrolledCourse,
}
