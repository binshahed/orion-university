import { z } from 'zod'
import { Types } from 'mongoose'
import { DaysOfWeek } from './offeredCourse.const'

// Define the Zod schema for TOfferedCourse
const createOfferedCourseSchema = z.object({
  body: z.object({
    semesterRegistration: z
      .string()
      .refine((val) => Types.ObjectId.isValid(val), {
        message: 'Invalid ObjectId for semesterRegistration',
      }),
    academicSemester: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid ObjectId for academicSemester',
    }),
    academicFaculty: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid ObjectId for academicFaculty',
    }),
    academicDepartment: z
      .string()
      .refine((val) => Types.ObjectId.isValid(val), {
        message: 'Invalid ObjectId for academicDepartment',
      }),
    course: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid ObjectId for course',
    }),
    faculty: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid ObjectId for faculty',
    }),
    maxCapacity: z.number({
      required_error: 'Max capacity is required',
    }),
    section: z.number({
      required_error: 'Section is required',
    }),
    days: z.enum([...DaysOfWeek] as [string, ...string[]], {
      errorMap: () => ({
        message: 'Day must be one of: Sat, Sun, Mon, Tue, Wed, Thu, Fri',
      }),
    }),
    startTime: z.string({
      required_error: 'Start time is required',
    }),
    endTime: z.string({
      required_error: 'End time is required',
    }),
  }),
})

const updateOfferedCourseSchema = z.object({
  body: z.object({
    faculty: z
      .string()
      .refine((val) => Types.ObjectId.isValid(val), {
        message: 'Invalid ObjectId for faculty',
      })
      .optional(),
    maxCapacity: z
      .number({
        required_error: 'Max capacity is required',
      })
      .optional(),
    section: z.number({
      required_error: 'Section is required',
    }),
    days: z
      .enum([...DaysOfWeek] as [string, ...string[]], {
        errorMap: () => ({
          message: 'Day must be one of: Sat, Sun, Mon, Tue, Wed, Thu, Fri',
        }),
      })
      .optional(),
    startTime: z.string({
      required_error: 'Start time is required',
    }),
    endTime: z
      .string({
        required_error: 'End time is required',
      })
      .optional(),
  }),
})

// Type alias for the parsed schema

export const offeredCourseValidation = {
  createOfferedCourseSchema,
  updateOfferedCourseSchema,
}
