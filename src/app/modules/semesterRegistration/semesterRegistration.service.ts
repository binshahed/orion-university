import httpStatus from 'http-status'
import AppError from '../../errors/AppError'

import { TSemesterRegistration } from './semesterRegistration.interface'
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model'
import { SemesterRegistrationModel } from './semesterRegistration.model'
import { QueryBuilder } from '../../builder/QueryBuilder'
import {
  SemesterRegistrationStatus,
  semesterRegistrationExcludedFields,
} from './semesterRegistration.constant'

const createSemesterRegistration = async (data: TSemesterRegistration) => {
  // check if the semester is 'UPCOMING' or 'ONGOING'

  const isSemesterRegistrationUpcomingOrOngoing =
    await SemesterRegistrationModel.findOne({
      $or: [
        { status: SemesterRegistrationStatus.UPCOMING },
        { status: SemesterRegistrationStatus.ONGOING },
      ],
    })

  if (isSemesterRegistrationUpcomingOrOngoing) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `There is already a ${isSemesterRegistrationUpcomingOrOngoing.status} registered semester `,
    )
  }

  // check if the semester is already registered
  const isAlreadyRegistered = await SemesterRegistrationModel.findOne({
    academicSemester: data?.academicSemester,
  })

  if (isAlreadyRegistered) {
    throw new AppError(
      httpStatus.CONFLICT,
      'This academic semester is already registered',
    )
  }

  // check if the semester is already registered
  const academicSemester = await AcademicSemesterModel.findById(
    data?.academicSemester,
  )

  if (!academicSemester) {
    throw new AppError(httpStatus.NOT_FOUND, 'AcademicSemester not found')
  }

  const result = await SemesterRegistrationModel.create(data)

  return result
}

const getSemesterRegistration = async (query: Record<string, unknown>) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistrationModel.find().populate({
      path: 'academicSemester',
      select: ['-createdAt', '-updatedAt', '-__v'],
    }),
    query,
  )
    .filter(semesterRegistrationExcludedFields)
    .sort()
    .paginate()
    .fields()

  const result = await semesterRegistrationQuery.modelQuery

  return result
}

const getSemesterRegistrationById = async (id: string) => {
  const result = await SemesterRegistrationModel.findById(id).populate({
    path: 'academicSemester',
    select: ['-createdAt', '-updatedAt', '-__v'],
  })

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Semester Registration not found')
  }

  return result
}

const updateSemesterRegistrationById = async (
  semesterRegistrationId: string,
  semesterRegistration: Partial<TSemesterRegistration>,
) => {
  // check if the semester is already exists
  const semesterRegistrationData = await SemesterRegistrationModel.findById(
    semesterRegistrationId,
  )

  const requestedStatus = semesterRegistration.status

  if (!semesterRegistrationData) {
    throw new AppError(httpStatus.NOT_FOUND, 'This academic semester not Found')
  }
  // if requested semester ended we will not update the registration
  if (semesterRegistrationData?.status === SemesterRegistrationStatus.ENDED) {
    throw new AppError(httpStatus.BAD_REQUEST, 'This semester is already ended')
  }

  if (
    semesterRegistrationData?.status === SemesterRegistrationStatus.UPCOMING &&
    requestedStatus === SemesterRegistrationStatus.ENDED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Yor can't update status ${semesterRegistrationData.status} to ${requestedStatus}`,
    )
  }
  if (
    semesterRegistrationData?.status === SemesterRegistrationStatus.ONGOING &&
    requestedStatus === SemesterRegistrationStatus.UPCOMING
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Yor can't update status ${semesterRegistrationData.status} to ${requestedStatus}`,
    )
  }

  const result = await SemesterRegistrationModel.findByIdAndUpdate(
    semesterRegistrationId,
    semesterRegistration,
    { new: true },
  )

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Semester Registration not found')
  }

  return result
}

export const semesterRegistrationService = {
  createSemesterRegistration,
  getSemesterRegistration,
  getSemesterRegistrationById,
  updateSemesterRegistrationById,
}
