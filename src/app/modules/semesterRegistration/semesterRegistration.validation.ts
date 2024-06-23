import { z } from 'zod'
import { Types } from 'mongoose'
import { SemesterRegistrationStatusEnum } from './semesterRegistration.constant'

// Define the Zod schema for creating semester registration
const createSemesterRegistrationSchema = z.object({
  body: z.object({
    academicSemester: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid ObjectId',
    }),
    status: z
      .enum([...SemesterRegistrationStatusEnum] as [string, ...string[]], {
        errorMap: () => ({
          message: 'Status must be one of: UPCOMING, ONGOING, ENDED',
        }),
      })
      .optional(),
    startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid datetime',
    }),
    endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid datetime',
    }),
    minCredit: z.number({ required_error: 'Min Credit is required' }),
    maxCredit: z.number({ required_error: 'Max Credit is required' }),
  }),
})

// Define the Zod schema for updating semester registration
const updateSemesterRegistrationSchema = z.object({
  body: z.object({
    academicSemester: z
      .string()
      .refine((val) => Types.ObjectId.isValid(val), {
        message: 'Invalid ObjectId',
      })
      .optional(),
    status: z
      .enum([...SemesterRegistrationStatusEnum] as [string, ...string[]], {
        errorMap: () => ({
          message: 'Status must be one of: UPCOMING, ONGOING, ENDED',
        }),
      })
      .optional(),
    startDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid datetime',
      })
      .optional(),
    endDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid datetime',
      })
      .optional(),
    minCredit: z.number().optional(),
    maxCredit: z.number().optional(),
  }),
})

export const semesterRegistrationValidation = {
  createSemesterRegistrationSchema,
  updateSemesterRegistrationSchema,
}
