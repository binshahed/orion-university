import { QueryBuilder } from '../../builder/QueryBuilder'
import { courseExcludedFields, courseSearchableFields } from './course.const'
import { TCourse } from './course.interface'
import { CourseModel } from './course.model'
import AppError from '../../errors/AppError'
import httpStatus from 'http-status'

const createCourse = async (course: TCourse) => {
  const newCourse = await CourseModel.create(course)
  return newCourse
}

const getCourses = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    CourseModel.find().populate({
      path: 'prerequisiteCourses.course',
      select: '-prerequisiteCourses -__v',
    }),
    query,
  )
    .search(courseSearchableFields)
    .filter(courseExcludedFields)
    .sort()
    .paginate()
    .fields()

  return courseQuery.modelQuery.exec()
}

const getCourseById = async (id: string) => {
  const course = await CourseModel.findById(id)
  if (!course) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found')
  }
  return course
}

const updateCourseById = async (id: string, updatedData: Partial<TCourse>) => {
  const { prerequisiteCourses, ...remainingField } = updatedData

  const updatedCourse = await CourseModel.findByIdAndUpdate(
    id,
    { $set: remainingField },
    { new: true, runValidators: true },
  )
  if (!updatedCourse) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found')
  }

  console.log(prerequisiteCourses)

  if (prerequisiteCourses && prerequisiteCourses.length > 0) {
    const deletedPrerequisiteCourseIds = prerequisiteCourses
      .filter((el) => el.course && el.isDeleted)
      .map((el) => el.course)

    const deletePrerequisiteCourse = await CourseModel.findByIdAndUpdate(id, {
      $pull: {
        prerequisiteCourses: { course: { $in: deletedPrerequisiteCourseIds } },
      },
    })
  }

  return updatedCourse
}

const deleteCourseById = async (id: string) => {
  const deletedCourse = await CourseModel.findOneAndUpdate(
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
  createCourse,
  getCourses,
  getCourseById,
  updateCourseById,
  deleteCourseById,
}
