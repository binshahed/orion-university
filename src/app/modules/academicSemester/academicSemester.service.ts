import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { academicSemesterMapper } from './academicSemester.constant'
import { TAcademicSemester } from './academicSemester.interface'
import { AcademicSemesterModel } from './academicSemester.model'

const createAcademicSemester = async (data: TAcademicSemester) => {
  if (academicSemesterMapper[data.name] !== data.code) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid semester code')
  }

  const academicSemester = new AcademicSemesterModel(data)
  await academicSemester.save()
  return academicSemester
}

const getAcademicSemester = async () => {
  const academicSemester = await AcademicSemesterModel.find()
  return academicSemester
}
const getAcademicSemesterById = async (id: string) => {
  const academicSemester = await AcademicSemesterModel.findById(id)
  return academicSemester
}

const updateAcademicSemesterById = async (
  academicSemesterId: string,
  academicSemester: Partial<TAcademicSemester>,
): Promise<TAcademicSemester | null> => {
  if (
    academicSemesterMapper[academicSemester.name as string] !==
    academicSemester.code
  ) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid semester code')
  }
  // Update student by id in the database
  const updatedAcademicSemester = await AcademicSemesterModel.findByIdAndUpdate(
    academicSemesterId,
    { $set: academicSemester },
    { new: true, runValidators: true },
  )
  return updatedAcademicSemester
}

export const academicSemesterService = {
  createAcademicSemester,
  getAcademicSemester,
  getAcademicSemesterById,
  updateAcademicSemesterById,
}
