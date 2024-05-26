import { Request, Response } from 'express';
import { UserValidation } from './user.validation';
import { userService } from './user.service';
import { TUser } from './user.interface';
import config from '../../config';
import { StudentValidation } from '../student/student.validation';
import { ZodError } from 'zod';
import { studentService } from '../student/student.service';

export const createUser = async (req: Request, res: Response) => {
  try {
    const { password, studentData } = req.body;

    const user: Partial<TUser> = {};

    // if password not given use default password
    user.password = password || config.defaultPassword;
    user.role = 'student';
    user.id = '203010002';

    // validate user data
    const validateUser = UserValidation.userValidationSchema.parse(user);

    // validate student data
    const validateStudent =
      StudentValidation.studentValidationSchema.parse(studentData);

    // create new user
    const newUser = await userService.createUser(validateUser);
    console.log(newUser);

    if (Object.keys(newUser).length) {
      validateStudent.id = newUser.id;
      validateStudent.user = newUser._id;
    }

    // create student record
    const newStudent = await studentService.createStudent(validateStudent);

    res.status(201).send(newStudent);
  } catch (err) {
    if (err instanceof ZodError) {
      // Handle validation errors
      res.status(400).send({ errors: err.errors });
    } else {
      res
        .status(500)
        .send({ message: 'Internal Server Error', error: err.message });
    }
  }
};

export const userController = {
  createUser,
};
