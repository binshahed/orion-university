import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { UserModel } from './user.model';

const findPreviousId = async (role: string) => {
  const lastStudent = await UserModel.findOne(
    {
      role: role,
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
  const lastStudentId = await findPreviousId('student');

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

export const generateFacultyId = async () => {
  let currentId = (0).toString();

  const lastFacultyId = await findPreviousId('faculty');

  const lastFacultyCode = lastFacultyId?.substring(2);

  if (lastFacultyId) {
    currentId = `F-${(Number(lastFacultyCode) + 1).toString().padStart(4, '0')}`;
  } else {
    currentId = `F-0001`;
  }

  return currentId;
};
