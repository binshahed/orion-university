import httpStatus from 'http-status'
import { AcademicFacultyModel } from '../academicFaculty/academicFaculty.model'
import { TAcademicDepartment } from './academicDepartment.interface'
import { AcademicDepartmentModel } from './academicDepartment.model'
import AppError from '../../errors/AppError'

const createAcademicDepartment = async (data: TAcademicDepartment) => {
  const academicFaculty = AcademicFacultyModel.findById(data.academicFaculty)
  if (!academicFaculty) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Faculty not found')
  }
  const academicDepartment = new AcademicDepartmentModel(data)
  await academicDepartment.save()
  return academicDepartment
}

const getAcademicDepartments = async () => {
  const academicDepartments = await AcademicDepartmentModel.find().populate({
    path: 'academicFaculty',
    select: 'name -_id',
  })
  return academicDepartments
}

const getAcademicDepartmentById = async (data: string) => {
  const academicDepartment = await AcademicDepartmentModel.findById(
    data,
  ).populate({
    path: 'academicFaculty',
    select: 'name -_id',
  })
  return academicDepartment
}
const updateAcademicDepartment = async (
  id: string,
  data: TAcademicDepartment,
) => {
  const academicDepartment = await AcademicDepartmentModel.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true },
  )

  if (!academicDepartment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Department not found')
  }

  return academicDepartment
}

export const academicDepartmentService = {
  createAcademicDepartment,
  getAcademicDepartments,
  getAcademicDepartmentById,
  updateAcademicDepartment,
}
