import { NextFunction, Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
const auth = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const headers = req.headers
    console.log(headers)
  })
}

export default auth
