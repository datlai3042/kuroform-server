import { NextFunction, Request, Response } from 'express'
import reasonCode from '~/Core/reasonStatusCode'
import statusCode from '~/Core/statusCode'
import { ErrorServer } from '~/type'

const errorHandler = <ErrorCustom extends ErrorServer>(error: ErrorCustom, req: Request, res: Response, next: NextFunction) => {
      console.log('Mã lỗi:', JSON.parse(JSON.stringify(error.stack || '500')))
      console.log('Mô tả lỗi', JSON.parse(JSON.stringify(error.message || 'Không xác định')))

      const code = error.code ? error.code : statusCode.INTERNAL_SERVER_ERROR
      const message = error.message ? error.message : reasonCode.INTERNAL_SERVER_ERROR
      const metadata = error.metadata ? error.metadata : null
      return res.status(code).send({ code, message, metadata })
}

export default errorHandler
