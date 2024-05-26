import { TUser } from './user.interface';
import { UserModel } from './user.model';

const createStudent = async (userData: TUser) => {
  const createUser = await UserModel.create(userData);
  return createUser;
};

export const userService = {
  createStudent,
};
