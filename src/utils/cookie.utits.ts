import { Response } from 'express'
import { setCookieResponse } from './dataResponse.utils'
import ms from 'ms'

export const setCookieAuth = ({
      client_id,
      code_verify_token,
      refresh_token,
      access_token,
      res
}: {
      client_id: string
      code_verify_token: string
      refresh_token: string

      access_token: string
      res: Response
}) => {
      const now = new Date().getTime()
      const expireCookieTime = new Date(Number(now + ms(process.env.EXPIRE_REFRESH_TOKEN as string))).toString()
<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
      const expireTokenTime = new Date(Number(now + ms(process.env.EXPIRE_ACCESS_TOKEN as string))).toString()

      setCookieResponse(res, expireCookieTime, 'client_id', client_id, { httpOnly: true })
      setCookieResponse(res, expireCookieTime, 'code_verify_token', code_verify_token, { httpOnly: true })

      const expireToken = setCookieResponse(res, expireTokenTime, 'access_token', access_token, { httpOnly: true })
      const expireCookie = setCookieResponse(res, expireCookieTime, 'refresh_token', refresh_token, { httpOnly: true })
      return { expireToken, expireCookie }
=======
=======
>>>>>>> effc9bd709197e600109bd44d046e7198402c8ce
>>>>>>> 221a1fe6068856c4044628949fe94ec144aef0e6
      const expireToken = new Date(Number(now + ms(process.env.EXPIRE_ACCESS_TOKEN as string)))

      setCookieResponse(res, expireCookieTime, 'client_id', client_id, { httpOnly: true })
      setCookieResponse(res, expireCookieTime, 'code_verify_token', code_verify_token, { httpOnly: true })
      setCookieResponse(res, expireCookieTime, 'access_token', access_token, { httpOnly: true })
      const expireCookie = setCookieResponse(res, expireCookieTime, 'refresh_token', refresh_token, { httpOnly: true })
      return { expireToken , expireCookie}
<<<<<<< HEAD
=======
      const expireTokenTime = new Date(Number(now + ms(process.env.EXPIRE_ACCESS_TOKEN as string))).toString()

      setCookieResponse(res, expireCookieTime, 'client_id', client_id, { httpOnly: true })
      setCookieResponse(res, expireCookieTime, 'code_verify_token', code_verify_token, { httpOnly: true })

      const expireToken = setCookieResponse(res, expireTokenTime, 'access_token', access_token, { httpOnly: true })
      const expireCookie = setCookieResponse(res, expireCookieTime, 'refresh_token', refresh_token, { httpOnly: true })
      return { expireToken, expireCookie }
>>>>>>> 77389b1 (Fix bug api trong phần auth)
=======
<<<<<<< HEAD
>>>>>>> effc9bd (Thêm thời gian hết hạn token để check middlewares ở client)
=======
>>>>>>> effc9bd709197e600109bd44d046e7198402c8ce
>>>>>>> 221a1fe6068856c4044628949fe94ec144aef0e6
}

export const clearCookieAuth = ({ res }: { res: Response }) => {
      res.clearCookie('client_id')
      res.clearCookie('refresh_token')
      res.clearCookie('code_verify_token')
      res.clearCookie('access_token')
}
