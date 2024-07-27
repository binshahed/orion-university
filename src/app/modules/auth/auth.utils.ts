import jwt, { JwtPayload } from 'jsonwebtoken'

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

export const verifyToken = (token: string, key: string) => {
  return jwt.verify(token, key) as JwtPayload
}
