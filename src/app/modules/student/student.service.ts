/* eslint-disable @typescript-eslint/no-explicit-any */
import { TStudent } from './student.interface';
import { StudentModel } from './student.models';

const getStudents = async () => {
  const student = await StudentModel.find()
    .populate({
      path: 'admissionSemester',
      select: 'name code year startMonth endMonth -_id',
    })
    .populate({
      path: 'academicDepartment',
      select: 'name academicFaculty -_id',
      populate: {
        path: 'academicFaculty',
        select: 'name -_id',
      },
    });
  return student;
};

const createStudent = async (validatedStudent: TStudent) => {
  const student = new StudentModel(validatedStudent);
  await student.save();
  return student;
};

const getStudentById = async (id: string) => {
  const student = await StudentModel.findById(id)
    .populate({
      path: 'admissionSemester',
      select: 'name code year startMonth endMonth -_id',
    })
    .populate({
      path: 'academicDepartment',
      select: 'name academicFaculty -_id',
      populate: {
        path: 'academicFaculty',
        select: 'name -_id',
      },
    });
  return student;
};

const updateStudentById = async (
  studentId: string,
  student: Partial<TStudent>,
): Promise<TStudent | null> => {
  // Update student by id in the database
  const updatedStudent = await StudentModel.findByIdAndUpdate(
    studentId,
    { $set: student },
    { new: true, runValidators: true },
  );

  return updatedStudent;
};

const deleteStudentById = async (studentId: string): Promise<void> => {
  await StudentModel.findByIdAndDelete(studentId);
};

export const studentService = {
  getStudents,
  createStudent,
  getStudentById,
  updateStudentById,
  deleteStudentById,
};
