import { QueryBuilder } from '../../builder/QueryBuilder'
import { courseExcludedFields } from './offeredCourse.const'
import { TOfferedCourse } from './offeredCourse.interface'

import AppError from '../../errors/AppError'
import httpStatus from 'http-status'
import { OfferedCourseModel } from './offeredCourse.model'

const createOfferedCourse = async (course: TOfferedCourse) => {
  const newCourse = await OfferedCourseModel.create(course)
  return newCourse
}

const getOfferedCourse = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    OfferedCourseModel.find().populate({
      path: 'prerequisiteCourses.course',
      select: '-prerequisiteCourses -__v',
    }),
    query,
  )
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
  updatedData: Partial<TOfferedCourse>,
) => {
  const { prerequisiteCourses, ...remainingField } = updatedData

  const updatedCourse = await OfferedCourseModel.findByIdAndUpdate(
    id,
    { $set: remainingField },
    { new: true, runValidators: true },
  )
  if (!updatedCourse) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found')
  }

  if (prerequisiteCourses && prerequisiteCourses.length > 0) {
    const deletedPrerequisiteCourseIds = prerequisiteCourses
      .filter((el) => el.course && el.isDeleted)
      .map((el) => el.course)

    await OfferedCourseModel.findByIdAndUpdate(id, {
      $pull: {
        prerequisiteCourses: { course: { $in: deletedPrerequisiteCourseIds } },
      },
    })

    const addPrerequisiteCourseIds = prerequisiteCourses
      .filter((el) => el.course && !el.isDeleted)
      .map((el) => el)

    await OfferedCourseModel.findByIdAndUpdate(id, {
      $addToSet: { prerequisiteCourses: { $each: addPrerequisiteCourseIds } },
    })
  }

  const result = await OfferedCourseModel.findById(id)

  return result
}

const deleteOfferedCourseById = async (id: string) => {
  const deletedCourse = await OfferedCourseModel.findOneAndUpdate(
    { id },
    { isDeleted: true },
    { new: true },
  )
  if (!deletedCourse) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found')
  }
  return deletedCourse
}

export const courseService = {
  createOfferedCourse,
  getOfferedCourse,
  getOfferedCourseById,
  updateOfferedCourseById,
  deleteOfferedCourseById,
}
