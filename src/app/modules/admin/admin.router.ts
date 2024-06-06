import { Router } from 'express'
import { adminController } from './admin.controller'
import validateRequest from '../../middlewares/validateRequest'
import { adminValidation } from './admin.validation'

const router = Router()

router.route('/').get(adminController.getAdmin)
router
  .route('/:adminId')
  .get(adminController.getAdminById)
  .patch(
    validateRequest(adminValidation.updateAdminValidationSchema),
    adminController.updateAdminById,
  )
  .delete(adminController.deleteAdminById)

export const adminRouter = router
