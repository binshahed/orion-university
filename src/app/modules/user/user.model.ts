import { Schema, model } from 'mongoose'
import { TUser, TUserModel } from './user.interface'
import bcrypt from 'bcrypt'
import config from '../../config'

const userSchema = new Schema<TUser, TUserModel>(
  {
    id: { type: String, unique: true, required: true },
    password: { type: String, select: 0 },
    passwordChangeAt: { type: Date },
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
)

userSchema.index({ id: 1 }, { unique: true })

userSchema.pre('save', async function (next) {
  const user = this as TUser
  // hash password
  if (user.password) {
    // hash password
    user.password = await bcrypt.hash(user.password, Number(config.saltRound))
  }
  next()
})

userSchema.post('save', function (doc, next) {
  const user = doc as TUser
  user.password = ''
  next()
})

userSchema.statics.isUserExistsByCustomId = async function (id: string) {
  return await UserModel.findOne({ id }).select('+password')
}

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword)
}

userSchema.statics.isJwtIssuedBeforePasswordChanged = function (
  passwordChangeTime: Date,
  jwtIssuedTimeStamp: number,
) {
  const passwordChangeTimeStamp = new Date(passwordChangeTime).getTime() / 1000

  return jwtIssuedTimeStamp < passwordChangeTimeStamp
}

export const UserModel = model<TUser, TUserModel>('User', userSchema)
