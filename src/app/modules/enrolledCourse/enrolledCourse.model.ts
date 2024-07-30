import { model, Schema } from 'mongoose'
import { TCourseMarks, TEnrolledCourse } from './enrolledCourse.interface'
import { grad } from './enrolledCourse.const'

const courseMarksSchema = new Schema<TCourseMarks>(
  {
    classTest1: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    MidTerm: {
      type: Number,
      default: 0,
      min: 0,
      max: 30,
    },
    classTest2: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    finalTerm: {
      type: Number,
      default: 0,
      min: 0,
      max: 50,
    },
  },
  {
    _id: false,
  },
)

const enrolledCourseSchema = new Schema<TEnrolledCourse>({
  semesterRegistration: {
    type: Schema.Types.ObjectId,
    required: [true, 'Semester registration is required'],
    ref: 'SemesterRegistration',
  },
  academicSemester: {
    type: Schema.Types.ObjectId,
    required: [true, 'Academic semester is required'],
    ref: 'AcademicSemester',
  },
  academicFaculty: {
    type: Schema.Types.ObjectId,
    required: [true, 'Academic faculty is required'],
    ref: 'AcademicFaculty',
  },
  academicDepartment: {
    type: Schema.Types.ObjectId,
    required: [true, 'Academic department is required'],
    ref: 'AcademicDepartment',
  },
  offeredCourse: {
    type: Schema.Types.ObjectId,
    required: [true, 'Offered course is required'],
    ref: 'OfferedCourse',
  },
  course: {
    type: Schema.Types.ObjectId,
    required: [true, 'Course is required'],
    ref: 'Course',
  },
  student: {
    type: Schema.Types.ObjectId,
    required: [true, 'Student is required'],
    ref: 'Student',
  },
  faculty: {
    type: Schema.Types.ObjectId,
    required: [true, 'Faculty is required'],
    ref: 'Faculty',
  },
  isEnrolled: {
    type: Boolean,
    default: false,
  },
  courseMarks: {
    type: courseMarksSchema,
    default: {},
    required: [true, 'Course marks are required'],
  },
  grad: {
    type: String,
    enum: grad,
    required: [true, 'Grade is required'],
    default: 'NA',
  },
  gradPoint: {
    type: Number,
    default: 0,
    min: 0,
    max: 4,
    required: [true, 'Grad point is required'],
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
})

export const EnrolledCourseModel = model<TEnrolledCourse>(
  'EnrolledCourse',
  enrolledCourseSchema,
)
