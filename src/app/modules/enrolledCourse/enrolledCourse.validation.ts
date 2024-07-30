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
    courseMark: z.object({
      classTest1: z.number(),
      midterm: z.number(),
      classTest2: z.number(),
      finalTerm: z.number(),
    }),
  }),
})

export const EnrolledCourseValidation = {
  createEnrolledCourseValidationSchema,
  updateEnrolledCourseValidationSchema,
}
