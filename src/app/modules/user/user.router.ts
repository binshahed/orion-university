import { Router } from 'express';
import { userController } from './user.controller';

import { StudentValidation } from '../student/student.validation';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';

const router = Router();

router.post(
  '/create-student',
  validateRequest(UserValidation.userValidationSchema),
  validateRequest(StudentValidation.studentValidationSchema),
  userController.createUser,
);

export const userRouter = router;
