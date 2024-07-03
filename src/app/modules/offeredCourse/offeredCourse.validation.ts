import { z } from 'zod'
import { Types } from 'mongoose'
import { DaysOfWeek } from './offeredCourse.const'

const timeFormat = /^([01]\d|2[0-3]):([0-5]\d)$/

// Define the Zod schema for TOfferedCourse
const createOfferedCourseSchema = z.object({
  body: z
    .object({
      semesterRegistration: z
        .string()
        .refine((val) => Types.ObjectId.isValid(val), {
          message: 'Invalid ObjectId for semesterRegistration',
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
      days: z.array(z.enum([...DaysOfWeek] as [string, ...string[]])),
      startTime: z
        .string({
          required_error: 'Start time is required',
        })
        .regex(timeFormat, {
          message: 'Invalid time format. Expected HH:MM',
        }),
      endTime: z
        .string({
          required_error: 'End time is required',
        })
        .regex(timeFormat, {
          message: 'Invalid time format. Expected HH:MM',
        }),
    })
    .refine(
      (body) => {
        const start = new Date(`1970-01-01T${body.startTime}:00`)
        const end = new Date(`1970-01-01T${body.endTime}:00`)

        return start < end
      },
      { message: 'Start time must be earlier than end time.' },
    ),
})

const updateOfferedCourseSchema = z.object({
  body: z
    .object({
      faculty: z.string().refine((val) => Types.ObjectId.isValid(val), {
        message: 'Invalid ObjectId for faculty',
      }),

      maxCapacity: z.number({
        required_error: 'Max capacity is required',
      }),

      days: z.array(z.enum([...DaysOfWeek] as [string, ...string[]]), {
        errorMap: () => ({
          message: 'Day must be one of: Sat, Sun, Mon, Tue, Wed, Thu, Fri',
        }),
      }),
      startTime: z.string().regex(timeFormat, {
        message: 'Invalid time format. Expected HH:MM',
      }),
      endTime: z.string().regex(timeFormat, {
        message: 'Invalid time format. Expected HH:MM',
      }),
    })
    .refine(
      (body) => {
        if (body.startTime && body.endTime) {
          const start = new Date(`1970-01-01T${body.startTime}:00`)
          const end = new Date(`1970-01-01T${body.endTime}:00`)
          return start < end
        }
        return true // Only validate if both times are provided
      },
      { message: 'Start time must be earlier than end time.' },
    ),
})

// Type alias for the parsed schema
export const offeredCourseValidation = {
  createOfferedCourseSchema,
  updateOfferedCourseSchema,
}
