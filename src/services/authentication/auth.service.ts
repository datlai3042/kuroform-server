import axios from 'axios'
import { NextFunction, Response } from 'express'
import { Types } from 'mongoose'
import { AuthFailedError, BadRequestError, NotFoundError, ResponseError } from '~/Core/response.error'
import keyManagerModel from '~/model/keyManager.model'
import { notificationModel } from '~/model/notification.model'
import userModel, { UserDocument } from '~/model/user.model'
import { CustomRequest, OAuth, Token } from '~/type'
import { checkDataUser, checkMailAndCreateUser, handleCookieAndKeyRefreshToken, handleKeyAndCookie } from '~/utils/authentication.utils'
import { compare, hassPassword } from '~/utils/bcrypt.utils'
import { clearCookieAuth, setCookieAuth } from '~/utils/cookie.utits'
import { expriresAT, omit, oneWeek, setCookieResponse } from '~/utils/dataResponse.utils'
import createANotification from '~/utils/notification'
import {
      caseAccountExist,
      caseAccountNew,
      errorDenied,
      getApiGithubCore,
      getApiGoogleCore,
      getEmailPrimaryGithub,
      getGithubUser,
      getGoogleUser,
      getOAuthGithubToken,
      getOAuthGoogleToken
} from '~/utils/oAuth'
import { createPayload, fillDataKeyModel, generateCodeVerifyToken, generatePaidKey, generatePaidToken } from '~/utils/token.utils'

type AuthParam = {
      email: string
      password: string
      first_name: string
      last_name: string
}

class AuthService {
      static async register(req: CustomRequest<AuthParam>, res: Response, next: NextFunction) {
            const { email, password, first_name, last_name } = req.body

            if (!email || !password || !first_name || !last_name) throw new AuthFailedError({ metadata: 'Request thiếu các field bắt buốc' })

            const { user } = await checkMailAndCreateUser({ email, last_name, first_name, password })
            await createANotification({ user_id: user?._id, type: 'System', core: { message: 'Cảm ơn bạn đã tạo tài khoản' } })

            const { access_token, code_verify_token, expireToken, refresh_token, expireCookie } = await handleKeyAndCookie({ user, res })

            return {
                  user: omit(user.toObject(), ['user_password']),
                  token: { access_token, refresh_token, code_verify_token },
                  expireToken,
                  client_id: user._id,
                  expireCookie
            }
      }

      static async login(req: CustomRequest<AuthParam>, res: Response, next: NextFunction) {
            const { email, password } = req.body
            const { user } = await checkDataUser({ email, password })

<<<<<<< HEAD
<<<<<<< HEAD
            const { access_token, code_verify_token, expireToken, refresh_token , expireCookie} = await handleKeyAndCookie({ user, res })
=======
            const { access_token, code_verify_token, expireToken, refresh_token ,expireCookie} = await handleKeyAndCookie({ user, res })
>>>>>>> 77389b1 (Fix bug api trong phần auth)
=======
<<<<<<< HEAD
            const { access_token, code_verify_token, expireToken, refresh_token ,expireCookie} = await handleKeyAndCookie({ user, res })
=======
            const { access_token, code_verify_token, expireToken, refresh_token , expireCookie} = await handleKeyAndCookie({ user, res })
>>>>>>> effc9bd (Thêm thời gian hết hạn token để check middlewares ở client)
=======
            const { access_token, code_verify_token, expireToken, refresh_token , expireCookie} = await handleKeyAndCookie({ user, res })
>>>>>>> effc9bd709197e600109bd44d046e7198402c8ce
>>>>>>> 221a1fe6068856c4044628949fe94ec144aef0e6
            await createANotification({ user_id: user?._id, type: 'System', core: { message: 'Chào mừng bạn quay trở lại' } })

            return {
                  user: omit(user.toObject(), ['user_password']),
                  token: { access_token, refresh_token, code_verify_token },
expireCookie,
                  expireToken,
                  client_id: user._id,
                  expireCookie

            }
      }

      static async logout(req: CustomRequest, res: Response, next: NextFunction) {
            const user = req.user as UserDocument
            const { force } = req.body
            await createANotification({
                  user_id: user?._id as Types.ObjectId,
                  type: 'System',
                  core: { message: 'Đăng xuất thành công' }
            })
            clearCookieAuth({ res })

            await keyManagerModel.findOneAndDelete({ user_id: user._id })

            return force ? { message: 'Logout thành công' } : { message: 'Token hết hạn và đẵ buộc phải logout', force }
      }

      static async refresh_token(req: CustomRequest, res: Response, next: NextFunction) {
            const { refresh_token } = req
            const { user } = req

<<<<<<< HEAD
<<<<<<< HEAD
            const { access_token, code_verify_token, expireToken, new_refresh_token , expireCookie} = await handleCookieAndKeyRefreshToken({
=======
            const { access_token, code_verify_token, expireToken, new_refresh_token, expireCookie} = await handleCookieAndKeyRefreshToken({
>>>>>>> 77389b1 (Fix bug api trong phần auth)
=======
<<<<<<< HEAD
            const { access_token, code_verify_token, expireToken, new_refresh_token, expireCookie} = await handleCookieAndKeyRefreshToken({
=======
            const { access_token, code_verify_token, expireToken, new_refresh_token , expireCookie} = await handleCookieAndKeyRefreshToken({
>>>>>>> effc9bd (Thêm thời gian hết hạn token để check middlewares ở client)
=======
            const { access_token, code_verify_token, expireToken, new_refresh_token , expireCookie} = await handleCookieAndKeyRefreshToken({
>>>>>>> effc9bd709197e600109bd44d046e7198402c8ce
>>>>>>> 221a1fe6068856c4044628949fe94ec144aef0e6
                  user: user as UserDocument,
                  refresh_token_used: refresh_token as string,
                  res
            })
            return {
                  user: omit(user?.toObject(), ['user_password']),
                  token: { access_token, refresh_token: new_refresh_token, code_verify_token },
                  expireToken,
<<<<<<< HEAD
<<<<<<< HEAD
                  client_id: (user?._id as Types.ObjectId).toString(),
                  expireCookie
=======
expireCookie,
                  client_id: (user?._id as Types.ObjectId).toString()
>>>>>>> 77389b1 (Fix bug api trong phần auth)
=======
<<<<<<< HEAD
expireCookie,
                  client_id: (user?._id as Types.ObjectId).toString()
=======
                  client_id: (user?._id as Types.ObjectId).toString(),
                  expireCookie
>>>>>>> effc9bd (Thêm thời gian hết hạn token để check middlewares ở client)
=======
                  client_id: (user?._id as Types.ObjectId).toString(),
                  expireCookie
>>>>>>> effc9bd709197e600109bd44d046e7198402c8ce
>>>>>>> 221a1fe6068856c4044628949fe94ec144aef0e6
            }
      }

      static async oAuthWithGoogle(req: CustomRequest<object, { code: string; error: string }>, res: Response, next: NextFunction) {
            const { code, error } = req.query
            if (error === 'access_denied') {
                  errorDenied({ res })
            }

            const google_user = await getApiGoogleCore({ code })

            if (!google_user.verified_email) {
                  throw new BadRequestError({ metadata: 'Email Không hợp lệ' })
            }

            const found_user_system = await userModel.findOne({ user_email: google_user.email })
            if (found_user_system) {
                  await caseAccountExist({ user: found_user_system, res })
            } else {
                  const { email, family_name, given_name, picture } = google_user
                  await caseAccountNew({ last_name: family_name, first_name: given_name, avatar_url: picture, user_email: email, res })
            }
      }

      static async oAuthWithGithub(req: CustomRequest<object, { code: string; error: string }>, res: Response, next: NextFunction) {
            const { code, error } = req.query

            if (error === 'access_denied') {
                  errorDenied({ res })
            }

            const { userGithub, user_email } = await getApiGithubCore({ code })

            const found_user_system = await userModel.findOne({ user_email: user_email })

            if (found_user_system) {
                  await caseAccountExist({ user: found_user_system, res })
            } else {
                  const { avatar_url, name } = userGithub
                  const split_name = name.split(' ')
                  const [first_name, ...all] = split_name
                  const last_name = all.join(' ')
                  await caseAccountNew({ last_name, first_name, avatar_url, user_email, res })
            }
      }
}

export default AuthService
