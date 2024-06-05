import { Router } from 'express';
import { userController } from './user.controller';

import { StudentValidation } from '../student/student.validation';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
import { facultyValidation } from '../faculty/faculty.validation';

const router = Router();

router.post(
  '/create-student',
  validateRequest(UserValidation.userValidationSchema),
  validateRequest(StudentValidation.studentValidationSchema),
  userController.createUser,
);

router.post(
  '/create-faculty',
  validateRequest(UserValidation.userValidationSchema),
  validateRequest(facultyValidation.facultyValidationSchema),
  userController.createFaculty,
);

export const userRouter = router;
