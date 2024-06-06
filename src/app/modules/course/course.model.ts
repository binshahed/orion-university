import { Schema, model } from 'mongoose'
import { TCourse, TPrerequisiteCourses } from './course.interface'

const prerequisiteCourses = new Schema<TPrerequisiteCourses>({
  course: { type: Schema.Types.ObjectId, ref: 'Course' },
  isDeleted: { type: Boolean, default: false },
})

const courseSchema = new Schema<TCourse>({
  title: { type: String, required: true, trim: true, unique: true },
  code: { type: Number, required: true, trim: true },
  prefix: { type: String, required: true, trim: true },
  credits: { type: Number, required: true, trim: true },
  prerequisiteCourses: [prerequisiteCourses],
  isDeleted: { type: Boolean, default: false },
})

export const CourseModel = model<TCourse>('Course', courseSchema)
