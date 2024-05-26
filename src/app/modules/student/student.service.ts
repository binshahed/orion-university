import { StudentModel } from './student.models';

const getStudents = async () => {
  const student = await StudentModel.find();
  return student;
};

export const studentService = {
  getStudents,
};
