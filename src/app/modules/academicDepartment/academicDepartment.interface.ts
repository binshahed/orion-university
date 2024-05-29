import { ObjectId } from 'mongoose';

export type TAcademicDepartment = {
  name: string;
  academicFaculty: ObjectId;
};
