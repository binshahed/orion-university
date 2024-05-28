/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, UpdateQuery, model } from 'mongoose';
import { TAcademicSemester } from './academicSemester.interface';
import {
  Months,
  AcademicSemesterCode,
  AcademicSemesterName,
} from './academicSemester.constant';

const academicSemesterSchema = new Schema<TAcademicSemester>({
  name: {
    type: String,
    enum: AcademicSemesterName,
    required: [true, 'Name is required'],
  },
  code: {
    type: String,
    enum: AcademicSemesterCode,
    required: [true, 'Code is required'],
  },
  year: {
    type: String,
    max: 4,
    required: [true, 'Year is required'],
  },
  endMonth: {
    type: String,
    enum: Months,
    required: [true, 'End Month is required'],
  },
  startMonth: {
    type: String,
    enum: Months,
    required: [true, 'Start Month is required'],
  },
});

academicSemesterSchema.pre('save', async function (next) {
  try {
    const semester = await AcademicSemesterModel.findOne({
      name: this.name,
      year: this.year,
    });

    if (semester) {
      throw new Error('Academic Semester Already Exists');
    }
    next();
  } catch (error: any) {
    next(error);
  }
});

async function academicSemesterUpdatePreHock(this: any, next: any) {
  try {
    const update = this.getUpdate() as UpdateQuery<TAcademicSemester>;
    if (update) {
      const { name, year } = update;
      if (name && year) {
        const semester = await AcademicSemesterModel.findOne({
          name: name,
          year: year,
        });

        if (semester) {
          throw new Error('Academic Semester Already Exists');
        }
      }
    }
    next();
  } catch (error: any) {
    next(error);
  }
}

// Middleware for updateOne operation
academicSemesterSchema.pre('updateOne', academicSemesterUpdatePreHock);
academicSemesterSchema.pre('findOneAndUpdate', academicSemesterUpdatePreHock);

export const AcademicSemesterModel = model<TAcademicSemester>(
  'AcademicSemester',
  academicSemesterSchema,
);
