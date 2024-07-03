import { Types } from 'mongoose'

export type TDaysOfWeek = 'Sat' | 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'

export type TOfferedCourse = {
  semesterRegistration: Types.ObjectId
  academicSemester?: Types.ObjectId
  academicFaculty: Types.ObjectId
  academicDepartment: Types.ObjectId
  course: Types.ObjectId
  faculty: Types.ObjectId
  maxCapacity: number
  section: number
  days: TDaysOfWeek[]
  startTime: string
  endTime: string
}
