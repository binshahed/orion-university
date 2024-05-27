import { Router } from 'express';
import { studentController } from './student.controller';

const router = Router();

router.route('/').get(studentController.getStudents);
router
  .route('/:studentId')
  .get(studentController.getStudentById)
  .patch(studentController.updateStudentById)
  .delete(studentController.deleteStudentById);

export const StudentRouter = router;
