/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserModel } from './user.model';

const createUser = async (userData: any) => {
  const createUser = new UserModel(userData);
  await createUser.save();
  return createUser;
};

export const userService = {
  createUser,
};
