import mongoose from 'mongoose'
import { QueryBuilder } from '../../builder/QueryBuilder'
import { adminExcludedFields, adminSearchableFields } from './admin.const'
import { TAdmin } from './admin.interface'
import { AdminModel } from './admin.model'
import AppError from '../../errors/AppError'
import httpStatus from 'http-status'
import { UserModel } from '../user/user.model'

const getAdmins = (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(AdminModel.find(), query)
    .search(adminSearchableFields)
    .filter(adminExcludedFields)
    .sort()
    .paginate()
    .fields()

  return adminQuery.modelQuery.exec()
}

const getAdminById = async (id: string) => {
  const admin = await AdminModel.findOne({ id })

  return admin
}

const updateAdminById = async (id: string, admin: Partial<TAdmin>) => {
  // Destructure the name field from the rest of the admin data
  const { name, ...remainingAdminData } = admin
  // Create a new object to hold the modified data
  const modifiedData: Record<string, unknown> = {
    ...remainingAdminData,
  }

  // If name is provided and it contains keys, flatten it
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedData[`name.${key}`] = value
    }
  }

  // Perform the update operation using findOneAndUpdate
  const updatedAdmin = await AdminModel.findOneAndUpdate(
    { id: id },
    { $set: modifiedData },
    { new: true, runValidators: true },
  )

  return updatedAdmin
}

const deleteAdminById = async (id: string) => {
  const session = await mongoose.startSession()
  try {
    await session.startTransaction()
    const admin = await AdminModel.findOne({ id })

    if (!admin || admin.isDeleted) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Admin not found')
    }

    const deletedAdmin = await AdminModel.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    )

    if (!deletedAdmin) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Filed to delete admin')
    }

    const deletedUser = await UserModel.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    )

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Filed to delete student')
    }

    await session.commitTransaction()
  } catch (err) {
    await session.abortTransaction()
  } finally {
    await session.endSession()
  }
}

export const adminService = {
  getAdmins,
  getAdminById,
  updateAdminById,
  deleteAdminById,
}
