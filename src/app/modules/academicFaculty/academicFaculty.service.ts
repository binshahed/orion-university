import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TAcademicFaculty } from './academicFaculty.interface';
import { AcademicFacultyModel } from './academicFaculty.model';

const createAcademicFaculty = async (data: TAcademicFaculty) => {
  const academicFaculty = new AcademicFacultyModel(data);
  await academicFaculty.save();
  return academicFaculty;
};

const getAcademicFaculties = async () => {
  const academicFaculties = await AcademicFacultyModel.find();
  return academicFaculties;
};

const getAcademicFacultyById = async (data: string) => {
  const academicFaculty = await AcademicFacultyModel.findById(data);
  return academicFaculty;
};
const updateAcademicFaculty = async (id: string, data: TAcademicFaculty) => {
  const academicFaculty = await AcademicFacultyModel.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true },
  );

  if (!academicFaculty) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Faculty not found');
  }

  return academicFaculty;
};

export const academicFacultyService = {
  createAcademicFaculty,
  getAcademicFaculties,
  getAcademicFacultyById,
  updateAcademicFaculty,
};
