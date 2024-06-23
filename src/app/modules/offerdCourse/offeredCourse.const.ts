import { TDaysOfWeek } from './offeredCourse.interface'

export const DaysOfWeek: TDaysOfWeek[] = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
] as const

export const courseExcludedFields = [
  'searchTerm',
  'sort',
  'limit',
  'page',
  'fields',
]
