/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { TStudent } from './student.interface';
import { StudentModel } from './student.models';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { UserModel } from '../user/user.model';
const getStudents = async (query: Record<string, unknown>) => {
  const queryCopy = structuredClone(query);
  let searchTerm = '';

  if (query.searchTerm) {
    searchTerm = query.searchTerm as string;
  }

  const searchConditions = [
    'email',
    'name.firstName',
    'name.lastName',
    'presentAddress',
  ].map((field) => ({
    [field]: {
      $regex: searchTerm,
      $options: 'i',
    },
  }));

  const studentQuery = StudentModel.find({
    $or: searchConditions,
  });

  const excludedFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];

  excludedFields.forEach((field) => delete queryCopy[field]);

  const filteredQuery = studentQuery
    .find(queryCopy)
    .populate({
      path: 'admissionSemester',
      select: 'name code year startMonth endMonth -_id',
    })
    .populate({
      path: 'academicDepartment',
      select: 'name academicFaculty -_id',
      populate: {
        path: 'academicFaculty',
        select: 'name -_id',
      },
    });

  let sortField = '-createdAt';

  if (query.sort) {
    sortField = query.sort as string;
  }

  const sortedQuery = filteredQuery.sort(sortField);

  let limit = 1;
  let page = 1;
  let skip = 0;

  if (query.limit) {
    limit = Number(query.limit);
  }

  const limitedQuery = sortedQuery.limit(limit);

  if (query.page) {
    page = Number(query.page);
    skip = (page - 1) * limit;
  }

  const paginatedQuery = limitedQuery.skip(skip);

  let selectedFields = '';

  if (query.fields) {
    selectedFields = (query.fields as string).split(',').join(' ');
  }

  const finalQuery = await paginatedQuery.select(selectedFields);

  return finalQuery;
};

// create students

const createStudent = async (validatedStudent: TStudent) => {
  const student = new StudentModel(validatedStudent);
  await student.save();
  return student;
};

const getStudentById = async (id: string) => {
  const student = await StudentModel.findById(id)
    .populate({
      path: 'admissionSemester',
      select: 'name code year startMonth endMonth -_id',
    })
    .populate({
      path: 'academicDepartment',
      select: 'name academicFaculty -_id',
      populate: {
        path: 'academicFaculty',
        select: 'name -_id',
      },
    });
  return student;
};

const updateStudentById = async (
  studentId: string,
  student: Partial<TStudent>,
): Promise<TStudent | null> => {
  // Update student by id in the database

  const { name, guardian, localGuardian, ...remainingStudentData } = student;

  const modifiedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      console.log(name);

      modifiedData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedData[`guardian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedData[`localGuardian.${key}`] = value;
    }
  }

  const updatedStudent = await StudentModel.findByIdAndUpdate(
    studentId,
    { $set: modifiedData },
    { new: true, runValidators: true },
  );

  return updatedStudent;
};

const deleteStudentById = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();
    const student = await StudentModel.findOne({ id });

    if (!student || student.isDeleted) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Student not found');
    }

    const deletedStudent = await StudentModel.findOneAndUpdate(
      { id },
      { isDeleted: true },
      {
        new: true,
        session,
      },
    );

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Filed to delete student');
    }

    const deletedUser = await UserModel.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Filed to delete student');
    }

    await session.commitTransaction();

    return deletedStudent;
  } catch (err) {
    await session.abortTransaction();
  } finally {
    await session.endSession();
  }
};

export const studentService = {
  getStudents,
  createStudent,
  getStudentById,
  updateStudentById,
  deleteStudentById,
};
