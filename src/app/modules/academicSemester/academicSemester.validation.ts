import { z } from 'zod';
import {
  Months,
  AcademicSemesterName,
  AcademicSemesterCode,
} from './academicSemester.constant';

export const academicSemesterValidation = z.object({
  name: z.enum([...AcademicSemesterName] as [string, ...string[]]),
  code: z.enum([...AcademicSemesterCode] as [string, ...string[]]),
  year: z.date(),
  startMonth: z.enum([...Months] as [string, ...string[]]),
  endMonth: z.enum([...Months] as [string, ...string[]]),
});
