export type TUser = {
  id: string;
  password?: string | undefined;
  needsPasswordChange?: boolean;
  role?: 'student' | 'faculty' | 'admin';
  status?: 'in-progress' | 'blocked';
  isDeleted?: boolean;
};

export type TNewUser = {
  password: string;
  role: string;
  id: string;
};
