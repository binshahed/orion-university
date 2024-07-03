import { QueryBuilder } from '../../builder/QueryBuilder'
import { courseExcludedFields } from './offeredCourse.const'
import { TOfferedCourse } from './offeredCourse.interface'

import AppError from '../../errors/AppError'
import httpStatus from 'http-status'
import { OfferedCourseModel } from './offeredCourse.model'
import { semesterRegistrationService } from '../semesterRegistration/semesterRegistration.service'
import { academicFacultyService } from '../academicFaculty/academicFaculty.service'
import { academicDepartmentService } from '../academicDepartment/academicDepartment.service'
import { courseService } from '../course/course.service'
import { FacultyModel } from '../faculty/faculty.model'
import { AcademicDepartmentModel } from '../academicDepartment/academicDepartment.model'
import { TSchedule, hasTimeConflict } from './offeredCourse.utils'
import { SemesterRegistrationModel } from '../semesterRegistration/semesterRegistration.model'

const createOfferedCourse = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime,
  } = payload

  // checking semester registration exist
  const isSemesterRegistrationExist =
    await semesterRegistrationService.getSemesterRegistrationById(
      semesterRegistration.toString(),
    )
  if (!isSemesterRegistrationExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Semester Registration not found')
  }
  // checking academic faculty exist
  const isAcademicFacultyExist =
    await academicFacultyService.getAcademicFacultyById(
      academicFaculty.toString(),
    )
  if (!isAcademicFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Faculty not found')
  }
  // checking academic department exist
  const isAcademicDepartmentExist =
    await academicDepartmentService.getAcademicDepartmentById(
      academicDepartment.toString(),
    )
  if (!isAcademicDepartmentExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Department not found')
  }

  // checking course exist
  const isCourseExist = await courseService.getCourseById(course.toString())
  if (!isCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found')
  }

  // checking faculty exist
  const isFacultyExist = await FacultyModel.findById(faculty.toString())
  if (!isFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found')
  }

  // checking if department exists in faculty
  const isDepartmentBelongToFaculty = await AcademicDepartmentModel.findOne({
    _id: academicDepartment,
    academicFaculty,
  })

  if (!isDepartmentBelongToFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This ${isAcademicDepartmentExist.name} is not belong to this ${isAcademicFacultyExist.name}`,
    )
  }

  // check if same offered courses same section in same registered semester exists

  const isSameOfferedCourseSameSectionSameRegisteredSemester =
    await OfferedCourseModel.findOne({
      semesterRegistration,
      course,
      section,
    })

  if (isSameOfferedCourseSameSectionSameRegisteredSemester) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This offered course with same section same semester already exists',
    )
  }

  // get the schedule for faculty
  const assignedSchedule: TSchedule[] = await OfferedCourseModel.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime')

  const newSchedule: TSchedule = {
    days,
    startTime,
    endTime,
  }

  if (hasTimeConflict(assignedSchedule, newSchedule)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This Faculty is not available at that time! Choose a different schedule',
    )
  }

  const result = await OfferedCourseModel.create({
    ...payload,
    academicSemester: isSemesterRegistrationExist._id,
  })
  return result
}

const getOfferedCourse = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(OfferedCourseModel.find(), query)
    .filter(courseExcludedFields)
    .sort()
    .paginate()
    .fields()

  return courseQuery.modelQuery.exec()
}

const getOfferedCourseById = async (id: string) => {
  const course = await OfferedCourseModel.findById(id)
  if (!course) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found')
  }
  return course
}

const updateOfferedCourseById = async (
  id: string,
  payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
  const { faculty, days, startTime, endTime } = payload

  // checking is OfferedCourse exists
  const isOfferedCourseExists = await OfferedCourseModel.findById(id)
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course not found')
  }
  // checking is faculty is exists
  const isFacultyExists = await FacultyModel.findById(faculty)
  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found')
  }

  // get the schedule for faculty
  const semesterRegistration = isOfferedCourseExists.semesterRegistration

  const semesterRegistrationStatus =
    await SemesterRegistrationModel.findById(semesterRegistration)

  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You Can not update this offered Course as it is ${semesterRegistrationStatus?.status}`,
    )
  }

  const assignedSchedule: TSchedule[] = await OfferedCourseModel.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime')

  const newSchedule: TSchedule = {
    days,
    startTime,
    endTime,
  }

  if (hasTimeConflict(assignedSchedule, newSchedule)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This Faculty is not available at that time! Choose a different schedule',
    )
  }

  const result = OfferedCourseModel.findByIdAndUpdate(id, payload, {
    new: true,
  })
  return result
}

const deleteOfferedCourseById = async (id: string) => {
  /**
   * Step 1: check if the offered course exists
   * Step 2: check if the semester registration status is upcoming
   * Step 3: delete the offered course
   */
  const isOfferedCourseExists = await OfferedCourseModel.findById(id)

  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course not found')
  }

  const semesterRegistation = isOfferedCourseExists.semesterRegistration

  const semesterRegistrationStatus =
    await SemesterRegistrationModel.findById(semesterRegistation).select(
      'status',
    )

  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Offered course can not update ! because the semester ${semesterRegistrationStatus}`,
    )
  }

  const result = await OfferedCourseModel.findByIdAndDelete(id)

  return result
}

export const offeredCourseService = {
  createOfferedCourse,
  getOfferedCourse,
  getOfferedCourseById,
  updateOfferedCourseById,
  deleteOfferedCourseById,
}
