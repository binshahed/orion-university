import { z } from 'zod'

const dateRegex = /^(19|20)\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/

const nameSchema = z.object({
  firstName: z.string().nonempty('First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().nonempty('Last name is required'),
})

const facultyValidationSchema = z.object({
  body: z.object({
    facultyData: z.object({
      designation: z.string().nonempty('Designation is required'),
      name: nameSchema,
      gender: z.enum(['male', 'female'], {
        message: 'Gender must be either male or female',
      }),
      dateOfBirth: z
        .string({ message: 'Date of birth is required' })
        .regex(dateRegex)
        .refine(
          (date) => {
            if (!date) return true // allow undefined or null (optional field)
            return dateRegex.test(date)
          },
          {
            message: 'Date of birth must be in the format YYYY-MM-DD.',
          },
        ),
      email: z.string().nonempty('Email is required').email('Email is invalid'),
      contactNo: z.string().nonempty('Contact number is required'),
      emergencyContactNo: z
        .string()
        .nonempty('Emergency contact number is required'),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z.string().nonempty('Present address is required'),
      permanentAddress: z.string().nonempty('Permanent address is required'),
      profileImg: z.string().optional(),
      academicDepartment: z
        .string()
        .nonempty('Academic department reference is required'),
      isDeleted: z.boolean().optional().default(false),
    }),
  }),
})

const updateFacultyValidationSchema = z.object({
  body: z
    .object({
      designation: z.string().optional(),
      name: z
        .object({
          firstName: z.string().optional(),
          middleName: z.string().optional(),
          lastName: z.string().optional(),
        })
        .optional(),
      gender: z
        .enum(['male', 'female'], {
          message: 'Gender must be either male or female',
        })
        .optional(),
      dateOfBirth: z
        .string()
        .regex(dateRegex)
        .refine(
          (date) => {
            if (!date) return true // allow undefined or null (optional field)
            return dateRegex.test(date)
          },
          {
            message: 'Date of birth must be in the format YYYY-MM-DD.',
          },
        )
        .optional(),
      email: z.string().email('Email is invalid').optional(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
      profileImg: z.string().optional(),
      academicDepartment: z.string().optional(),
      isDeleted: z.boolean().optional(),
    })
    .strict(),
})

export const facultyValidation = {
  facultyValidationSchema,
  updateFacultyValidationSchema,
}
