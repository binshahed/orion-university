import {
  TAcademicCode,
  TAcademicName,
  TAcademicSemesterMapper,
  TMonth,
} from './academicSemester.interface';

export const Months: TMonth[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const AcademicSemesterName: TAcademicName[] = [
  'Autumn',
  'Summer',
  'Fall',
];
export const AcademicSemesterCode: TAcademicCode[] = ['01', '02', '03'];

export const academicSemesterMapper: TAcademicSemesterMapper = {
  Autumn: '01',
  Summer: '02',
  Fall: '03',
};
