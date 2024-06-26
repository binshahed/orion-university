import jwt from 'jsonwebtoken'

export const createToken = (
  payload: { userId: string; role: string },
  secretKey: string,
  expireTime: string,
) => {
  return jwt.sign(
    {
      data: payload,
    },
    secretKey,
    { expiresIn: expireTime },
  )
}
