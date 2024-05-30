import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { UserModel } from './user.model';

const findPreviousId = async () => {
  const lastStudent = await UserModel.findOne(
    {
      role: 'student',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({ createdAt: -1 })
    .lean();

  return lastStudent?.id ? lastStudent.id : undefined;
};
// 2030 02 0001

// generate student id
export const generateStudentId = async (
  semesterData: TAcademicSemester,
): Promise<string> => {
  let currentId = (0).toString();
  const lastStudentId = await findPreviousId();

  const lastStudentCode = lastStudentId?.substring(4, 6);
  const lastStudentYear = lastStudentId?.substring(0, 4);
  const currentStudentCode = semesterData.code;
  const currentStudentYear = semesterData.year;

  if (
    lastStudentId &&
    lastStudentCode === currentStudentCode &&
    lastStudentYear === currentStudentYear
  ) {
    currentId = lastStudentId.substring(6);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `${semesterData.year}${semesterData.code}${incrementId}`;

  return incrementId;
};
