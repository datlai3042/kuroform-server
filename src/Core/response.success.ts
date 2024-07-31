import { Response } from 'express'
import statusCode from './statusCode'
import reasonCode from './reasonStatusCode'
import { Http } from '~/type'

class ResponseSuccess {
      private code: number
      private message: string
      private metadata: any

      constructor({ code = statusCode.OK, message = reasonCode.OK, metadata }: Http.ResSucess) {
            this.code = code
            this.message = message
            this.metadata = metadata
      }

      send(res: Response) {
            return res.json(this)
      }
}

class CREATE extends ResponseSuccess {
      constructor({ code = statusCode.CREATED, message = reasonCode.CREATED, metadata = {} }: Http.ResSucess) {
            super({ code, message, metadata })
      }
}

class OK extends ResponseSuccess {
      constructor({ code = statusCode.OK, message = reasonCode.OK, metadata = {} }: Http.ResSucess) {
            super({ code, message, metadata })
      }
}

export { CREATE, ResponseSuccess, OK }
