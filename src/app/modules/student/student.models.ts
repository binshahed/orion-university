import { Schema, model } from 'mongoose';
import { TStudent } from './student.interface';

const StudentSchema = new Schema<TStudent>(
  {
    id: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: {
      firstName: { type: String, required: [true, 'First name is required'] },
      middleName: { type: String },
      lastName: { type: String, required: [true, 'Last name is required'] },
    },
    gender: { type: String, required: [true, 'Gender is required'] },
    dateOfBirth: { type: Date, required: [true, 'Date of birth is required'] },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [/\S+@\S+\.\S+/, 'Email is invalid'],
    },
    contactNo: {
      type: String,
      required: [true, 'Contact number is required'],
      match: [/^\d{10}$/, 'Contact number must be 10 digits'],
    },
    emergencyContactNo: {
      type: String,
      required: [true, 'Emergency contact number is required'],
      match: [/^\d{10}$/, 'Emergency contact number must be 10 digits'],
    },
    presentAddress: {
      type: String,
      required: [true, 'Present address is required'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent address is required'],
    },
    guardian: {
      fatherName: {
        type: String,
        required: [true, "Father's name is required"],
      },
      fatherContactNo: {
        type: String,
        required: [true, "Father's contact number is required"],
        match: [/^\d{10}$/, "Father's contact number must be 10 digits"],
      },
      fatherOccupation: {
        type: String,
        required: [true, "Father's occupation is required"],
      },
      motherName: {
        type: String,
        required: [true, "Mother's name is required"],
      },
      motherContactNo: {
        type: String,
        required: [true, "Mother's contact number is required"],
        match: [/^\d{10}$/, "Mother's contact number must be 10 digits"],
      },
      motherOccupation: {
        type: String,
        required: [true, "Mother's occupation is required"],
      },
    },
    localGuardian: {
      name: {
        type: String,
        required: [true, "Local guardian's name is required"],
      },
      contactNo: {
        type: String,
        required: [true, "Local guardian's contact number is required"],
        match: [
          /^\d{10}$/,
          "Local guardian's contact number must be 10 digits",
        ],
      },
      occupation: {
        type: String,
        required: [true, "Local guardian's occupation is required"],
      },
      address: {
        type: String,
        required: [true, "Local guardian's address is required"],
      },
    },
    profileImage: { type: String },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      ref: 'Semester',
      required: true,
    },
    status: { type: String, required: [true, 'Status is required'] },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

export const StudentModel = model('Student', StudentSchema);
