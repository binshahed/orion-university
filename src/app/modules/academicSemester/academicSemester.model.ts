import { Schema, model } from 'mongoose';
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

export const AcademicSemesterModel = model<TAcademicSemester>(
  'AcademicSemester',
  academicSemesterSchema,
);
