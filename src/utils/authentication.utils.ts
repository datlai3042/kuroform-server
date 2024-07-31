import userModel, { UserDocument } from '~/model/user.model'
import { createPayload, fillDataKeyModel, generateCodeVerifyToken, generatePaidKey, generatePaidToken } from './token.utils'
import { AuthFailedError, ResponseError } from '~/Core/response.error'
import keyManagerModel from '~/model/keyManager.model'
import { Response } from 'express'
import { setCookieAuth } from './cookie.utits'
import createANotification from './notification'
import { compare } from 'bcrypt'
import { hassPassword } from './bcrypt.utils'

export const handleCookieAndKeyRefreshToken = async ({ user, refresh_token_used, res }: { user: UserDocument; refresh_token_used: string; res: Response }) => {
      const { public_key, private_key } = generatePaidKey()
      if (!public_key || !private_key) throw new ResponseError({ metadata: 'Server không thể tạo key sercet' })
      const payload = createPayload(user as UserDocument)

      const { access_token, refresh_token } = generatePaidToken(payload, { public_key, private_key })
      const code_verify_token = generateCodeVerifyToken()

      const keyModelQuery = { user_id: user?._id }
      const keyModelUpdate = {
            $set: { refresh_token, private_key, public_key, code_verify_token },
            $addToSet: { refresh_token_used: refresh_token_used }
      }
      const keyModelOption = { new: true, upsert: true }

      await keyManagerModel.findOneAndUpdate(keyModelQuery, keyModelUpdate, keyModelOption)

      const dataCookie = {
            client_id: user?._id.toString() || '',
            code_verify_token,
            refresh_token,
            access_token,
            res
      }

<<<<<<< HEAD
<<<<<<< HEAD
      const { expireToken , expireCookie} = setCookieAuth(dataCookie)
      return { expireToken, code_verify_token, access_token, new_refresh_token: refresh_token, expireCookie }
=======
      const { expireToken ,expireCookie} = setCookieAuth(dataCookie)
      return { expireToken, code_verify_token, access_token, new_refresh_token: refresh_token,expireCookie }
>>>>>>> 77389b1 (Fix bug api trong phần auth)
=======
<<<<<<< HEAD
      const { expireToken ,expireCookie} = setCookieAuth(dataCookie)
      return { expireToken, code_verify_token, access_token, new_refresh_token: refresh_token,expireCookie }
=======
      const { expireToken , expireCookie} = setCookieAuth(dataCookie)
      return { expireToken, code_verify_token, access_token, new_refresh_token: refresh_token, expireCookie }
>>>>>>> effc9bd (Thêm thời gian hết hạn token để check middlewares ở client)
=======
      const { expireToken , expireCookie} = setCookieAuth(dataCookie)
      return { expireToken, code_verify_token, access_token, new_refresh_token: refresh_token, expireCookie }
>>>>>>> effc9bd709197e600109bd44d046e7198402c8ce
>>>>>>> 221a1fe6068856c4044628949fe94ec144aef0e6
}

export const handleKeyAndCookie = async ({ user, res }: { user: UserDocument; res: Response }) => {
      await keyManagerModel.findOneAndDelete({ user_id: user._id })

      const { public_key, private_key } = generatePaidKey()
      if (!public_key || !private_key) throw new ResponseError({ metadata: 'Server không thể tạo key sercet' })

      const payload = createPayload(user)
      const { access_token, refresh_token } = generatePaidToken(payload, { public_key, private_key })
      const code_verify_token = generateCodeVerifyToken()

      const { modelKeyOption, modelKeyUpdate, modelKeyQuery } = fillDataKeyModel(user, public_key, private_key, refresh_token, code_verify_token)
      const keyStore = await keyManagerModel.findOneAndUpdate(modelKeyQuery, modelKeyUpdate, modelKeyOption)

      if (!keyStore) throw new ResponseError({ metadata: 'Server không thể tạo model key' })

      const dataCookie = {
            client_id: user._id.toString(),
            code_verify_token,
            refresh_token: refresh_token,
            access_token: access_token,
            res
      }

<<<<<<< HEAD
<<<<<<< HEAD
      const { expireToken,expireCookie } = setCookieAuth(dataCookie)
=======
      const { expireToken, expireCookie } = setCookieAuth(dataCookie)
>>>>>>> 77389b1 (Fix bug api trong phần auth)
=======
<<<<<<< HEAD
      const { expireToken, expireCookie } = setCookieAuth(dataCookie)
=======
      const { expireToken,expireCookie } = setCookieAuth(dataCookie)
>>>>>>> effc9bd (Thêm thời gian hết hạn token để check middlewares ở client)
=======
      const { expireToken,expireCookie } = setCookieAuth(dataCookie)
>>>>>>> effc9bd709197e600109bd44d046e7198402c8ce
>>>>>>> 221a1fe6068856c4044628949fe94ec144aef0e6

      return { expireToken, code_verify_token, access_token, refresh_token, expireCookie }
}

export const checkDataUser = async ({ email, password }: { email: string; password: string }) => {
      const foundUser = await userModel.findOne({ user_email: email })
      if (!foundUser) throw new AuthFailedError({ metadata: 'Không tìm thấy thông tin tài khoản' })

      const checkPassword = compare(password, foundUser?.user_password)
      if (!checkPassword) throw new AuthFailedError({ metadata: 'Không tin tài khoản không chính xác' })

      return { user: foundUser }
}

export const checkMailAndCreateUser = async ({
      email,
      password,
      last_name,
      first_name
}: {
      email: string
      password: string
      last_name: string
      first_name: string
}) => {
      const foundEmail = await userModel.findOne({ user_email: email })
      if (foundEmail) throw new AuthFailedError({ metadata: 'Email đã tồn tại' })

      const hashPassword = await hassPassword(password)

      const user_atlas = email.split('@')[0]

      const createUser = await userModel.create({
            user_email: email,
            user_password: hashPassword,
            user_first_name: first_name,
            user_last_name: last_name,
            user_auth: 'email',
            user_password_state: true,
            user_atlas
      })
      if (!createUser) throw new ResponseError({ metadata: 'Không thể đăng kí user do lỗi' })

      return { user: createUser }
}
