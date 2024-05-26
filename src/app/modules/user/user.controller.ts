import { Request, Response } from 'express';
import { UserValidation } from './user.validation';
import { userService } from './user.service';

export const createStudent = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    const validateUser = UserValidation.userValidationSchema.parse(userData);
    const user = await userService.createStudent(validateUser);
    res.status(201).send(user);
  } catch (err) {
    res.status(500).send(err);
  }
};
