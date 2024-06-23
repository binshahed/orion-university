import { TStatus } from './semesterRegistration.interface'

export const SemesterRegistrationStatusEnum: TStatus[] = [
  'UPCOMING',
  'ONGOING',
  'ENDED',
] as const
export const SemesterRegistrationStatus = {
  UPCOMING: 'UPCOMING',
  ONGOING: 'ONGOING',
  ENDED: 'ENDED',
} as const

export const semesterRegistrationExcludedFields = [
  'searchTerm',
  'sort',
  'limit',
  'page',
  'fields',
]
