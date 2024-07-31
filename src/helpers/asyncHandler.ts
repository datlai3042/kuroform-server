import { NextFunction, Request, RequestHandler, Response } from 'express'
import { CustomRequest } from '~/type'

export const asyncHandler = (fn: RequestHandler): RequestHandler => {
      return (req: Request | CustomRequest, res: Response, next: NextFunction) => {
            return Promise.resolve(fn(req, res, next)).catch(next)
      }
}
