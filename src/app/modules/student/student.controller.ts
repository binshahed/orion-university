import { Request, Response } from 'express';
import { studentService } from './student.service';

const getStudents = async (req: Request, res: Response) => {
  try {
    const student = await studentService.getStudents();

    res.status(200).send(student);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const studentController = {
  getStudents,
};
