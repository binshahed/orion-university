import { QueryBuilder } from '../../builder/QueryBuilder'
import { courseExcludedFields, courseSearchableFields } from './course.const'
import { TCourse, TCourseFaculty } from './course.interface'
import { CourseFacultyModel, CourseModel } from './course.model'
import AppError from '../../errors/AppError'
import httpStatus from 'http-status'
import mongoose from 'mongoose'

// create a new course
const createCourse = async (course: TCourse) => {
  const newCourse = await CourseModel.create(course)
  return newCourse
}

// get all courses
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

// get course by Id
const getCourseById = async (id: string) => {
  const course = await CourseModel.findById(id)
  if (!course) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found')
  }
  return course
}

// update course
const updateCourseById = async (id: string, updatedData: Partial<TCourse>) => {
  const { prerequisiteCourses, ...remainingField } = updatedData

  const session = await mongoose.startSession()

  try {
    await session.startTransaction()
    const updatedCourse = await CourseModel.findByIdAndUpdate(
      id,
      { $set: remainingField },

      { new: true, runValidators: true, session },
    )
    if (!updatedCourse) {
      throw new AppError(httpStatus.NOT_FOUND, 'Course not found')
    }

    if (prerequisiteCourses && prerequisiteCourses.length > 0) {
      const deletedPrerequisiteCourseIds = prerequisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course)

      const deletedPrerequisiteCourse = await CourseModel.findByIdAndUpdate(
        id,
        {
          $pull: {
            prerequisiteCourses: {
              course: { $in: deletedPrerequisiteCourseIds },
            },
          },
        },
        { new: true, runValidators: true, session },
      )

      if (!deletedPrerequisiteCourse) {
        throw new AppError(httpStatus.NOT_FOUND, 'Course not found')
      }

      const addPrerequisiteCourseIds = prerequisiteCourses
        .filter((el) => el.course && !el.isDeleted)
        .map((el) => el)

      const addPrerequisiteCourse = await CourseModel.findByIdAndUpdate(
        id,
        {
          $addToSet: {
            prerequisiteCourses: { $each: addPrerequisiteCourseIds },
          },
        },
        { new: true, runValidators: true, session },
      )

      if (!addPrerequisiteCourse) {
        throw new AppError(httpStatus.NOT_FOUND, 'Course not found')
      }
    }

    await session.commitTransaction()
    await session.endSession()

    const result = await CourseModel.findById(id).populate({
      path: 'prerequisiteCourses.course',
      select: '-prerequisiteCourses -__v',
    })

    return result
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found')
  }
}

// delete course

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

// assign faculties to db
const assignFacultiesWithCourseIntoDb = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFacultyModel.findByIdAndUpdate(
    id,
    {
      $addToSet: { faculties: { $each: payload } },
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
    },
  )

  return result
}

const removeFacultiesFromCourseRemoveDb = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFacultyModel.findByIdAndUpdate(
    id,
    {
      $pull: { faculties: { $in: payload } },
    },
    {
      new: true,
      runValidators: true,
    },
  )

  return result
}

export const courseService = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourseById,
  deleteCourseById,
  assignFacultiesWithCourseIntoDb,
  removeFacultiesFromCourseRemoveDb,
}
