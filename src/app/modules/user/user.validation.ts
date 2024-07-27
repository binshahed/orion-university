import { z } from 'zod'
import { USER_STATUS } from './user.const'

const userValidationSchema = z.object({
  password: z
    .string({ invalid_type_error: 'Password must be string' })
    .max(20, { message: 'password cannot be less than 20 characters' })
    .optional(),
})

const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...USER_STATUS] as [string, ...string[]], {
      message: 'Status must be either in-progress or blocked',
    }),
  }),
})

export const UserValidation = {
  userValidationSchema,
  changeStatusValidationSchema,
}
