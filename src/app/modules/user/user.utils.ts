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

  console.log(lastStudent);

  return lastStudent?.id ? lastStudent.id.substring(6) : undefined;
};

// generate student id
export const generateStudentId = async (
  semesterData: TAcademicSemester,
): Promise<string> => {
  const currentId = (await findPreviousId()) || (0).toString();
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementId = `${semesterData.year}${semesterData.code}${incrementId}`;

  return incrementId;
};
