import mongoose from 'mongoose'
import { QueryBuilder } from '../../builder/QueryBuilder'
import { facultyExcludedFields, facultySearchableFields } from './faculty.const'
import { TFaculty } from './faculty.interface'
import { FacultyModel } from './faculty.model'
import AppError from '../../errors/AppError'
import httpStatus from 'http-status'
import { UserModel } from '../user/user.model'

const getFaculties = (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(
    FacultyModel.find().populate('academicDepartment'),
    query,
  )
    .search(facultySearchableFields)
    .filter(facultyExcludedFields)
    .sort()
    .paginate()
    .fields()

  return facultyQuery.modelQuery.exec()
}

const getFacultyById = async (id: string) => {
  const faculty = await FacultyModel.findOne({ id }).populate(
    'academicDepartment',
  )

  return faculty
}

const updateFacultyById = async (id: string, faculty: Partial<TFaculty>) => {
  // Destructure the name field from the rest of the faculty data
  const { name, ...remainingFacultyData } = faculty
  // Create a new object to hold the modified data
  const modifiedData: Record<string, unknown> = {
    ...remainingFacultyData,
  }

  // If name is provided and it contains keys, flatten it
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedData[`name.${key}`] = value
    }
  }

  // Perform the update operation using findOneAndUpdate
  const updatedFaculty = await FacultyModel.findOneAndUpdate(
    { id: id },
    { $set: modifiedData },
    { new: true, runValidators: true },
  )

  return updatedFaculty
}

const deleteFacultyById = async (id: string) => {
  const session = await mongoose.startSession()
  try {
    await session.startTransaction()
    const faculty = await FacultyModel.findOne({ id })

    if (!faculty || faculty.isDeleted) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Faculty not found')
    }

    const deletedFaculty = await FacultyModel.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    )

    if (!deletedFaculty) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Filed to delete faculty')
    }

    const deletedUser = await UserModel.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    )

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Filed to delete student')
    }

    await session.commitTransaction()
  } catch (err) {
    await session.abortTransaction()
  } finally {
    await session.endSession()
  }
}

export const facultyService = {
  getFaculties,
  getFacultyById,
  updateFacultyById,
  deleteFacultyById,
}
