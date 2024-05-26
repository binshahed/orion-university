import { Router } from 'express';
import { createStudent } from './user.controller';

const router = Router();

router.post('/create-student', createStudent);

export const userRouter = router;
