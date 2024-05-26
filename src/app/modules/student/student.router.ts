import { Router } from 'express';
import { getStudents } from './student.controller';

const router = Router();

router.get('/', getStudents);

export const StudentRouter = router;
