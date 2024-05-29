import { Types } from 'mongoose';
import { z } from 'zod';

const objectIdValidation = z
  .string()
  .refine((val) => Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
  })
  .optional();

const studentValidationSchema = z.object({
  body: z.object({
    studentData: z.object({
      name: z.object({
        firstName: z.string(),
        middleName: z.string().optional(),
        lastName: z.string(),
      }),
      gender: z.enum(['male', 'female']),
      dateOfBirth: z.string(),
      email: z.string().email(),
      contactNo: z.string(),
      emergencyContactNo: z.string(),
      emergencyContact: z.string(),
      presentAddress: z.string(),
      permanentAddress: z.string(),
      guardian: z.object({
        fatherName: z.string(),
        fatherContactNo: z.string(),
        fatherOccupation: z.string(),
        motherName: z.string(),
        motherContactNo: z.string(),
        motherOccupation: z.string(),
      }),
      localGuardian: z.object({
        name: z.string(),
        contactNo: z.string(),
        occupation: z.string(),
        address: z.string(),
      }),
      profileImage: z.string(),
      academicDepartment: z.string(),
      admissionSemester: z.string(),
      isDeleted: z.boolean().default(false),
    }),
  }),
});

// Partial schema for updates
const PartialStudentValidationSchema = z.object({
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
  gender: z.enum(['male', 'female']).optional(),
  dateOfBirth: z.string().optional(),
  email: z.string().email().optional(),
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
  isDeleted: z.boolean().default(false).optional(),
});
export const StudentValidation = {
  studentValidationSchema,
  PartialStudentValidationSchema,
};
