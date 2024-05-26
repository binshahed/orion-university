import { Types } from 'mongoose';
import { z } from 'zod';

const objectIdValidation = z
  .string()
  .refine((val) => Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
  });

const studentValidationSchema = z.object({
  id: z.string().optional(),
  user: objectIdValidation,
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
  admissionSemester: z.string().optional(),
  isDeleted: z.boolean().default(false),
});

export const StudentValidation = {
  studentValidationSchema,
};
