import { ObjectId } from 'mongoose';

export type TName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TGuardian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation: string;
  motherContactNo: string;
};

export type TLocalGuardian = {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
};

export type TStudent = {
  id: string;
  user: ObjectId;
  name: TName;
  gender: 'male' | 'female';
  dateOfBirth: Date;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  emergencyContact: string;
  presentAddress: string;
  permanentAddress: string;
  guardian: TGuardian;
  localGuardian: TLocalGuardian;
  profileImage?: string;
  admissionSemester: ObjectId;
  status: string;
  isDeleted: boolean;
};
