import { z } from 'zod'

const createEnrolledCourseValidationSchema = z.object({
  body: z.object({
    offeredCourse: z.string(),
  }),
})

const updateEnrolledCourseValidationSchema = z.object({
  body: z.object({
    semesterRegistration: z.string(),
    offeredCourse: z.string(),
    student: z.string(),
    courseMarks: z.object({
      classTest1: z.number().max(100).optional(),
      midTerm: z.number().max(100).optional(),
      classTest2: z.number().max(100).optional(),
      finalTerm: z.number().max(100).optional(),
    }),
  }),
})

export const EnrolledCourseValidation = {
  createEnrolledCourseValidationSchema,
  updateEnrolledCourseValidationSchema,
}
