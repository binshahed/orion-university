/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, model } from 'mongoose'
import { TSemesterRegistration } from './semesterRegistration.interface'
import { SemesterRegistrationStatusEnum } from './semesterRegistration.constant'

const semesterRegistrationSchema = new Schema<TSemesterRegistration>(
  {
    academicSemester: {
      type: Schema.Types.ObjectId,
      required: [true, 'Academic semester is required'],
      ref: 'AcademicSemester',
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: SemesterRegistrationStatusEnum,
        message: '{VALUE} is not a valid status',
      },
      default: 'UPCOMING',
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    minCredit: {
      type: Number,
      required: [true, 'Min Credit is required'],
      default: 3,
    },
    maxCredit: {
      type: Number,
      required: [true, 'Max Credit is required'],
      default: 16,
      max: 16,
    },
  },
  {
    timestamps: true,
  },
)

// Create the model
export const SemesterRegistrationModel = model<TSemesterRegistration>(
  'SemesterRegistration',
  semesterRegistrationSchema,
)
