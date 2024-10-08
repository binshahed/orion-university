import { Schema, model } from 'mongoose'
import { TAdmin } from './admin.interface'

const AdminSchema = new Schema<TAdmin>({
  id: { type: String, required: [true, 'ID is required'], unique: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  designation: { type: String, required: [true, 'Designation is required'] },
  name: {
    firstName: { type: String, required: [true, 'First name is required'] },
    middleName: { type: String },
    lastName: { type: String, required: [true, 'Last name is required'] },
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: [true, 'Gender is required'],
  },
  dateOfBirth: { type: Date },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/\S+@\S+\.\S+/, 'Email is invalid'],
  },
  contactNo: { type: String, required: [true, 'Contact number is required'] },
  emergencyContactNo: {
    type: String,
    required: [true, 'Emergency contact number is required'],
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  presentAddress: {
    type: String,
    required: [true, 'Present address is required'],
  },
  permanentAddress: {
    type: String,
    required: [true, 'Permanent address is required'],
  },
  profileImg: { type: String },

  isDeleted: { type: Boolean, default: false },
})

export const AdminModel = model<TAdmin>('Admin', AdminSchema)
