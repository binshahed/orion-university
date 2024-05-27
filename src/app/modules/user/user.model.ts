import { Schema, model } from 'mongoose';
import { TUser } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<TUser>(
  {
    id: { type: String, unique: true, required: true },
    password: { type: String },
    needsPasswordChange: { type: Boolean, default: true },
    role: { type: String, enum: ['admin', 'student', 'faculty'] },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ id: 1 }, { unique: true });

userSchema.pre('save', async function (next) {
  const user = this as TUser;

  // hash password
  if (user.password) {
    // hash password
    user.password = await bcrypt.hash(user.password, Number(config.saltRound));
  }
  next();
});

userSchema.post('save', function (doc, next) {
  const user = doc as TUser;
  user.password = '';
  next();
});

export const UserModel = model('User', userSchema);
