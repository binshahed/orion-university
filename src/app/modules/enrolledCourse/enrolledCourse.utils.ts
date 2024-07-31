import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { StudentModel } from '../student/student.model'
import { Schema } from 'mongoose'
import { OfferedCourseModel } from '../offeredCourse/offeredCourse.model'
import { EnrolledCourseModel } from './enrolledCourse.model'

export const findStudentById = async (userId: string) => {
  const student = await StudentModel.findOne({ id: userId }, { _id: 1 })
  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found')
  }
  return student
}

export const findOfferedCourseById = async (
  offeredCourseId: Schema.Types.ObjectId,
) => {
  const offeredCourse = await OfferedCourseModel.findById(offeredCourseId)
  if (!offeredCourse) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found')
  }
  return offeredCourse
}

export const checkEnrollmentConflict = async (
  studentId: Schema.Types.ObjectId,
  offeredCourseId: Schema.Types.ObjectId,
  semesterRegistrationId: Schema.Types.ObjectId,
) => {
  const isStudentEnrolled = await EnrolledCourseModel.findOne({
    semesterRegistration: semesterRegistrationId,
    offeredCourse: offeredCourseId,
    student: studentId,
  })

  if (isStudentEnrolled) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Student is already enrolled in this course',
    )
  }
}

export const calculateTotalCredits = async (
  studentId: Schema.Types.ObjectId,
  semesterRegistrationId: Schema.Types.ObjectId,
) => {
  const enrolledCourses = await EnrolledCourseModel.aggregate([
    {
      $match: {
        student: studentId,
        semesterRegistration: semesterRegistrationId,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'alreadyEnrolledCourseData',
      },
    },
    {
      $unwind: '$alreadyEnrolledCourseData',
    },
    {
      $group: {
        _id: null,
        totalEnrolledCredits: { $sum: '$alreadyEnrolledCourseData.credits' },
      },
    },
    {
      $project: {
        _id: 0,
        totalEnrolledCredits: 1,
      },
    },
  ])

  return enrolledCourses.length > 0
    ? enrolledCourses[0].totalEnrolledCredits
    : 0
}

export const checkCreditLimit = async (
  totalCredits: number,
  courseCredits: number,
  maxCredit: number,
) => {
  if (totalCredits + courseCredits > maxCredit) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Credit limit exceeded for the semester',
    )
  }
}

export const calculateGradeAndPoints = (totalMarks: number) => {
  let result = {
    grade: 'NA',
    points: 0,
  }

  if (totalMarks >= 0 && totalMarks <= 19) {
    result = {
      grade: 'F',
      points: 0.0,
    }
  } else if (totalMarks >= 20 && totalMarks <= 39) {
    result = {
      grade: 'D',
      points: 2.0,
    }
  } else if (totalMarks >= 40 && totalMarks <= 59) {
    result = {
      grade: 'C',
      points: 3.0,
    }
  } else if (totalMarks >= 60 && totalMarks <= 79) {
    result = {
      grade: 'B',
      points: 3.5,
    }
  } else if (totalMarks >= 80 && totalMarks <= 100) {
    result = {
      grade: 'A',
      points: 4.0,
    }
  } else {
    result = {
      grade: 'NA',
      points: 0,
    }
  }

  return result
}
