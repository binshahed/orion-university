import { Router } from 'express';
import { studentController } from './student.controller';

const router = Router();

router.get('/', studentController.getStudents);

export const StudentRouter = router;
