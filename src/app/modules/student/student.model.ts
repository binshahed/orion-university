import { Schema, model } from 'mongoose'
import { TStudent } from './student.interface'

const StudentSchema = new Schema<TStudent>(
  {
    id: { type: String, unique: true, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: {
      firstName: { type: String, required: [true, 'First name is required'] },
      middleName: { type: String },
      lastName: { type: String, required: [true, 'Last name is required'] },
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: [true, 'Date of birth is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [/\S+@\S+\.\S+/, 'Email is invalid'],
    },
    contactNo: {
      type: String,
      required: [true, 'Contact number is required'],
    },
    emergencyContactNo: {
      type: String,
      required: [true, 'Emergency contact number is required'],
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
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment',
    },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemester',
    },

    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
)

// Middleware to prevent editing the user field
StudentSchema.pre('save', function (next) {
  if (!this.isNew) {
    // If the document is not new, do not allow the user field to be modified
    this.markModified('user')
  }
  next()
})

StudentSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } })
  next()
})

export const StudentModel = model<TStudent>('Student', StudentSchema)
