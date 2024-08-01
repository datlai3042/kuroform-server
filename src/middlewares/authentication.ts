import { NextFunction, Request, Response } from 'express'
import { Types } from 'mongoose'
import { AuthFailedError, BadRequestError, ForbiddenError } from '~/Core/response.error'
import { asyncHandler } from '~/helpers/asyncHandler'
import keyManagerModel from '~/model/keyManager.model'
import userModel from '~/model/user.model'
import { CustomRequest } from '~/type'
import { verifyAccessToken, verifyRefreshToken } from '~/utils/token.utils'

interface IHEADER {
      CLIENT_ID: string
      AUTHORIZATION: string
}

export const HEADER: IHEADER = {
      CLIENT_ID: 'x-client-id',
      AUTHORIZATION: 'authorization'
}

const authentication = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
      const client_id = req.cookies['client_id'] as string
      if (!client_id) {
            res.clearCookie('client_id')
            res.clearCookie('refresh_token')
            res.clearCookie('code_verify_token')
            res.clearCookie('access_token')
            throw new ForbiddenError({ metadata: 'CLIENT::Không truyền user_id' })
      }
      const access_token = req.cookies['access_token'] as string
      if (!access_token) throw new ForbiddenError({ metadata: 'Không tìm thấy access_token' })

      const user = await userModel.findOne({ _id: new Types.ObjectId(client_id) })
      if (!user) throw new ForbiddenError({ metadata: 'Không tìm thấy user' })

      const keyStore = await keyManagerModel.findOne({ user_id: user._id })
      if (!keyStore) throw new ForbiddenError({ metadata: 'Không tìm thấy key của user' })

            console.log({client: client_id, endpoint: req.originalUrl, roles: user.user_roles})

      if (req.originalUrl === '/v1/api/auth/logout') {
            const code_verify_token = req.cookies['code_verify_token'] as string

            if (keyStore.code_verify_token === code_verify_token || keyStore.user_id === new Types.ObjectId(client_id)) {
                  req.user = user
                  return next()
            }
      }

      //CASE: Auth refresh_token
      if (req.originalUrl === '/v1/api/auth/refresh-token') {
            const code_verify_token = req.cookies['code_verify_token'] as string
            if (code_verify_token.toLowerCase() !== keyStore.code_verify_token.toLowerCase()) {
                  throw new ForbiddenError({ metadata: 'Yêu cầu không hợp lệ' })
            }
            const refresh_token = req.cookies['refresh_token'] as string
            if (!refresh_token) return next(new ForbiddenError({ metadata: 'Không tìm thấy refresh_token' }))
            return verifyRefreshToken({ client_id, user, keyStore, token: refresh_token, key: keyStore.private_key, req, res, next })
      }

      //CASE: Auth access_token
      if (access_token) {
            return verifyAccessToken({ client_id, user, keyStore, token: access_token, key: keyStore.public_key, req, res, next })
      }
})

export default authentication
