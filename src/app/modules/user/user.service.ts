/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema } from 'mongoose';
import { UserModel } from './user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { TUser } from './user.interface';
import { TStudent } from '../student/student.interface';
import { StudentModel } from '../student/student.models';

const createUser = async (userData: Partial<TUser>, studentData: TStudent) => {
  const session = await mongoose.startSession();

  await session.startTransaction();

  try {
    const newUser = await UserModel.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    studentData.id = newUser[0].id;
    studentData.user = newUser[0]._id as unknown as Schema.Types.ObjectId;

    // create student record
    const newStudent = await StudentModel.create([studentData], { session });

    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent[0];
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
  }
};

export const userService = {
  createUser,
};
