import { Router } from 'express';
import { facultyController } from './faculty.controller';
import validateRequest from '../../middlewares/validateRequest';
import { facultyValidation } from './faculty.validation';

const router = Router();

router.route('/').get(facultyController.getFaculties);
router
  .route('/:facultyId')
  .get(facultyController.getFacultyById)
  .patch(
    validateRequest(facultyValidation.updateFacultyValidationSchema),
    facultyController.updateFacultyById,
  )
  .delete(facultyController.deleteFacultyById);

export const facultyRouter = router;
