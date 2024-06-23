import { z } from 'zod'

const prerequisiteCoursesSchema = z.object({
  course: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
    message: 'Invalid ObjectId',
  }),
  isDeleted: z.boolean().optional(),
})

const createCourseSchemaValidation = z.object({
  body: z.object({
    title: z.string().min(1).max(255),
    code: z.number().int(),
    prefix: z.string().min(1).max(10),
    credits: z.number().int(),
    prerequisiteCourses: z.array(prerequisiteCoursesSchema).optional(),
  }),
})

const updateCourseSchemaValidation = z.object({
  body: z.object({
    title: z.string().min(1).max(255).optional(),
    code: z.number().int().optional(),
    prefix: z.string().min(1).max(10).optional(),
    credits: z.number().int().optional(),
    prerequisiteCourses: z.array(prerequisiteCoursesSchema).optional(),
    isDeleted: z.boolean().optional(),
  }),
})

const facultiesWithCourseValidationSchema = z.object({
  body: z.object({
    faculties: z.array(z.string()),
  }),
})

export {
  createCourseSchemaValidation,
  updateCourseSchemaValidation,
  facultiesWithCourseValidationSchema,
}
