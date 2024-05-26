/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserModel } from './user.model';

const createUser = async (userData: any) => {
  const createUser = await UserModel.create(userData);
  return createUser;
};

export const userService = {
  createUser,
};
