import httpStatus from 'http-status'
import catchAsync from '../../../utils/catchAsync'
import sendResponse from '../../../utils/sendResponse'
import { adminService } from './admin.service'
import AppError from '../../errors/AppError'

const getAdmin = catchAsync(async (req, res) => {
  const admins = await adminService.getAdmins(req.query)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin fetched successfully!',
    data: admins,
  })
})

const getAdminById = catchAsync(async (req, res) => {
  const adminId: string = req.params.adminId
  const admin = await adminService.getAdminById(adminId)

  if (!admin) {
    throw new AppError(httpStatus.NOT_FOUND, 'Admin not found')
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin fetched successfully!',
    data: admin,
  })
})

const updateAdminById = catchAsync(async (req, res) => {
  const adminId: string = req.params.adminId
  const adminData = req.body

  // Validate the partial data with strict validation

  // update Student by id
  const admin = await adminService.updateAdminById(adminId, adminData)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin updated successfully!',
    data: admin,
  })
})

const deleteAdminById = catchAsync(async (req, res) => {
  const adminId: string = req.params.adminId
  const admin = await adminService.deleteAdminById(adminId)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin deleted successfully!',
    data: admin,
  })
})

export const adminController = {
  getAdmin,
  getAdminById,
  updateAdminById,
  deleteAdminById,
}
