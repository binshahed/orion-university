import { Types } from 'mongoose'
import { z } from 'zod'

const dateRegex = /^(19|20)\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/

const objectIdValidation = z
  .string()
  .refine((val) => Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
  })
  .optional()

const studentValidationSchema = z.object({
  body: z.object({
    studentData: z.object({
      name: z.object({
        firstName: z.string().nonempty({ message: 'First name is required' }),
        middleName: z.string().optional(),
        lastName: z.string({ message: 'Last name is required' }),
      }),
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

      email: z.string().email({ message: 'Invalid email address' }),
      contactNo: z.string({ message: 'Contact number is required' }),
      emergencyContactNo: z.string({
        message: 'Emergency contact number is required',
      }),
      emergencyContact: z.string({ message: 'Emergency contact is required' }),
      presentAddress: z.string({ message: 'Present address is required' }),
      permanentAddress: z.string({ message: 'Permanent address is required' }),
      guardian: z.object({
        fatherName: z.string({ message: "Father's name is required" }),
        fatherContactNo: z.string({
          message: "Father's contact number is required",
        }),
        fatherOccupation: z.string({
          message: "Father's occupation is required",
        }),
        motherName: z.string({ message: "Mother's name is required" }),
        motherContactNo: z.string({
          message: "Mother's contact number is required",
        }),
        motherOccupation: z.string({
          message: "Mother's occupation is required",
        }),
      }),
      localGuardian: z.object({
        name: z.string({ message: "Local guardian's name is required" }),
        contactNo: z.string({
          message: "Local guardian's contact number is required",
        }),
        occupation: z.string({
          message: "Local guardian's occupation is required",
        }),
        address: z.string({ message: "Local guardian's address is required" }),
      }),
      profileImage: z.string({ message: 'Profile image is required' }),
      academicDepartment: z.string({
        message: 'Academic department is required',
      }),
      admissionSemester: z.string({
        message: 'Admission semester is required',
      }),
      isDeleted: z.boolean().default(false),
    }),
  }),
})

// Partial schema for updates
const UpdateStudentValidationSchema = z.object({
  body: z
    .object({
      id: z.string().optional(),
      user: objectIdValidation,
      name: z
        .object({
          firstName: z.string().optional(),
          middleName: z.string().optional(),
          lastName: z.string().optional(),
        })
        .partial()
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
      email: z.string().email({ message: 'Invalid email address' }).optional(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
      guardian: z
        .object({
          fatherName: z.string().optional(),
          fatherContactNo: z.string().optional(),
          fatherOccupation: z.string().optional(),
          motherName: z.string().optional(),
          motherContactNo: z.string().optional(),
          motherOccupation: z.string().optional(),
        })
        .partial()
        .optional(),
      localGuardian: z
        .object({
          name: z.string().optional(),
          contactNo: z.string().optional(),
          occupation: z.string().optional(),
          address: z.string().optional(),
        })
        .partial()
        .optional(),
      profileImage: z.string().optional(),
      academicDepartment: z.string().optional(),
      admissionSemester: z.string().optional(),
      isDeleted: z.boolean().optional(),
    })
    .strict(),
})

export const StudentValidation = {
  studentValidationSchema,
  UpdateStudentValidationSchema,
}
