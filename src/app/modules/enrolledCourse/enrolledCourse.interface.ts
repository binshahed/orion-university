import { ObjectId } from 'mongoose'

export type TCourseMarks = {
  classTest1: number
  MidTerm: number
  classTest2: number
  finalTerm: number
}

export type TGrade = 'A' | 'B' | 'C' | 'D' | 'F' | 'NA'

export type TEnrolledCourse = {
  semesterRegistration: ObjectId
  academicSemester: ObjectId
  academicFaculty: ObjectId
  academicDepartment: ObjectId
  offeredCourse: ObjectId
  course: ObjectId
  student: ObjectId
  faculty: ObjectId
  isEnrolled: boolean
  courseMarks: TCourseMarks
  grad: TGrade
  gradPoint: number
  isCompleted: boolean
}
