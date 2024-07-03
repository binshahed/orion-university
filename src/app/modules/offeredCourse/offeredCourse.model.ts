import { Schema, model } from 'mongoose'
import { TOfferedCourse } from './offeredCourse.interface'
import { DaysOfWeek } from './offeredCourse.const'

// Define the Mongoose schema for TOfferedCourse
const offeredCourseSchema = new Schema<TOfferedCourse>({
  semesterRegistration: {
    type: Schema.Types.ObjectId,
    required: [true, 'Semester registration is required'],
    ref: 'SemesterRegistration', // Reference to the SemesterRegistration collection
  },
  academicSemester: {
    type: Schema.Types.ObjectId,
    required: [true, 'Academic semester is required'],
    ref: 'AcademicSemester', // Reference to the AcademicSemester collection
  },
  academicFaculty: {
    type: Schema.Types.ObjectId,
    required: [true, 'Academic faculty is required'],
    ref: 'AcademicFaculty', // Reference to the AcademicFaculty collection
  },
  academicDepartment: {
    type: Schema.Types.ObjectId,
    required: [true, 'Academic department is required'],
    ref: 'AcademicDepartment', // Reference to the AcademicDepartment collection
  },
  course: {
    type: Schema.Types.ObjectId,
    required: [true, 'Course is required'],
    ref: 'Course', // Reference to the Course collection
  },
  faculty: {
    type: Schema.Types.ObjectId,
    required: [true, 'Faculty is required'],
    ref: 'Faculty', // Reference to the Faculty collection
  },
  maxCapacity: {
    type: Number,
    required: [true, 'Max capacity is required'],
  },
  section: {
    type: Number,
    required: [true, 'Section is required'],
  },
  days: [
    {
      type: String,
      enum: {
        values: DaysOfWeek,
        message: '{VALUE} is not a valid day',
      },
      required: [true, 'Days are required'],
    },
  ],
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
  },
  endTime: {
    type: String,
    required: [true, 'End time is required'],
  },
})

// Create and export the model
export const OfferedCourseModel = model<TOfferedCourse>(
  'OfferedCourse',
  offeredCourseSchema,
)
