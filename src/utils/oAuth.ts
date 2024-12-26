import axios from 'axios'
import keyManagerModel from '~/model/keyManager.model'
import userModel, { UserDocument } from '~/model/user.model'
import { createPayload, fillDataKeyModel, generateCodeVerifyToken, generatePaidKey, generatePaidToken } from './token.utils'
import { setCookieAuth } from './cookie.utits'
import { Response } from 'express'
import { ResponseError } from '~/Core/response.error'
import { OAuth } from '~/type'
import { hassPassword } from './bcrypt.utils'

export const errorDenied = ({ res }: { res: Response }) => {
      const client_url = process.env.MODE === 'DEV' ? 'http://localhost:3000/login' : process.env.CLIENT_URL
      res.redirect(client_url as string)
}

export const getOAuthGoogleToken = async ({ code }: { code: string }) => {
      const body = {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.GOOGLE_AUTHORIZED_REDIRECT_URI,
            grant_type: 'authorization_code'
      }

      const url_origin = 'https://oauth2.googleapis.com/token'
      const options = { headers: { 'Content-type': 'application/x-www-form-urlencoded' } }

      const { data } = await axios.post(url_origin, body, options)

      return data
}

export const getGoogleUser = async ({ id_token, access_token }: { id_token: string; access_token: string }) => {
      const url_origin = 'https://www.googleapis.com/oauth2/v1/userinfo'
      const options = {
            params: {
                  access_token,
                  alt: 'json'
            },
            headers: {
                  Authorization: `Bearer ${id_token}`
            }
      }

      const { data } = await axios.get(url_origin, options)

      return data
}

export const getApiGoogleCore = async ({ code }: { code: string }) => {
      const data: { id_token: string; access_token: string } = await getOAuthGoogleToken({ code })

      const { id_token, access_token: access_token_google } = data

      const google_user: OAuth.Google.GoogleUserData = await getGoogleUser({ id_token, access_token: access_token_google })
      return google_user
}

export const getOAuthGithubToken = async ({ code }: { code: string }) => {
      const params = `client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}&scope=read:user,user:email`

      const url_origin = 'https://github.com/login/oauth/access_token?' + params
      const options = { headers: { Accept: 'application/json' } }
      const token = await axios.post(url_origin, {}, options)

      return token.data
}

export const getGithubUser = async ({ access_token }: { access_token: string }) => {
      const url_origin = 'https://api.github.com/user'
      const options = {
            headers: {
                  Authorization: `Bearer ${access_token}`
            }
      }

      const { data } = await axios.get(url_origin, options)

      return data
}

export const getApiGithubCore = async ({ code }: { code: string }) => {
      const { access_token: access_token_github } = (await getOAuthGithubToken({ code })) as { access_token: string }
      const userGithub: OAuth.Github.GithubUserData = await getGithubUser({ access_token: access_token_github })
      let user_email: string = ''
      if (userGithub.email) {
            user_email = userGithub.email
      } else {
            user_email = await getEmailPrimaryGithub({ token_github: access_token_github })
      }

      return { user_email, userGithub }
}

export const getEmailPrimaryGithub = async ({ token_github }: { token_github: string }) => {
      const getEmailApi = await axios.get<OAuth.Github.GetEmailData[]>('https://api.github.com/user/emails', {
            headers: {
                  Authorization: `token ${token_github}`
            }
      })

      let user_email = ''
      const length = getEmailApi.data.length
      if (length > 0) {
            for (let index = 0; index < length; index++) {
                  if (getEmailApi.data[index].primary) {
                        user_email = getEmailApi.data[index].email
                        break
                  }
            }
      }
      return user_email
}

export const caseAccountExist = async ({ user, res }: { user: UserDocument; res: Response }) => {
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
            refresh_token,
            access_token,
            res
      }

      const { expireToken,expireCookie } = setCookieAuth(dataCookie)

      const url_client =  process.env.CLIENT_URL + '/oauth'
      const url_full = `${url_client}?refresh_token=${refresh_token}&access_token=${access_token}&code_verify_token=${code_verify_token}&expireToken=${expireToken}&client_id=${user._id}&expireCookie=${expireCookie}`
      res.redirect(url_full)
}

export const caseAccountNew = async ({
      last_name,
      first_name,
      avatar_url,
      user_email,
      res
}: {
      last_name: string
      first_name: string
      avatar_url: string
      user_email: string
      res: Response
}) => {
      const { public_key, private_key } = generatePaidKey()
      if (!public_key || !private_key) throw new ResponseError({ metadata: 'Server không thể tạo key sercet' })
      const hashPassword = await hassPassword(process.env.KEY_PASSWORD as string)
      const user_atlas = user_email.split('@')[0]

      const user_data = {
            user_email,
            user_first_name: first_name,
            user_last_name: last_name,
            user_avatar_current: avatar_url,
            user_auth: 'oAuth',
            user_password: hashPassword,
            user_roles: 'USER',
            user_gender: 'MALE',
            user_atlas
      }

      const create_user = await userModel.create(user_data)

      const payload = createPayload(create_user)
      const { access_token, refresh_token } = generatePaidToken(payload, { public_key, private_key })
      const code_verify_token = generateCodeVerifyToken()

      const { modelKeyOption, modelKeyUpdate, modelKeyQuery } = fillDataKeyModel(create_user, public_key, private_key, refresh_token, code_verify_token)
      await keyManagerModel.findOneAndUpdate(modelKeyQuery, modelKeyUpdate, modelKeyOption)
      const dataCookie = {
            client_id: create_user._id.toString(),
            code_verify_token,
            refresh_token,
            access_token,
            res
      }

      const { expireToken ,expireCookie} = setCookieAuth(dataCookie)
      const url_client = process.env.MODE === 'DEV' ? 'http://localhost:3000/oauth' : process.env.CLIENT_URL + '/oauth'
      const url_full = `${url_client}?refresh_token=${refresh_token}&access_token=${access_token}&code_verify_token=${code_verify_token}&expireToken=${expireToken}&client_id=${create_user._id}&expireCookie=${expireCookie}`

      res.redirect(url_full)
}
