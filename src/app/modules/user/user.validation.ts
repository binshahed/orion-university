import { z } from 'zod';

const userValidationSchema = z.object({
  password: z
    .string({ invalid_type_error: 'Password must be string' })
    .max(20, { message: 'password cannot be less than 20 characters' })
    .optional(),
  role: z.string(),
  id: z.string(),
});

export const UserValidation = {
  userValidationSchema,
};
