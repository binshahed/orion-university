import { StudentModel } from './student.models';

const getStudents = async () => {
  const student = await StudentModel.find();
  return student;
};

const createStudent = async (validatedStudent) => {
  const student = new StudentModel(validatedStudent);
  await student.save();
  return student;
};

export const studentService = {
  getStudents,
  createStudent,
};
