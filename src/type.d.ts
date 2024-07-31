import { Request } from 'express'
import { UserDocument } from './model/user.model'
import { KeyManagerDocument } from './model/keyManager.model'
import mongoose, { ObjectId, Schema, Types } from 'mongoose'
import { FormSchema } from './model/form.model'

export declare global {
      declare module globalThis {
            // eslint-disable-next-line no-var
            var _io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
      }
}

export interface CustomRequest<Body = any, Query = any> extends Request {
      user?: UserDocument
      keyStore?: KeyManagerDocument
      refresh_token?: string
      force?: boolean
      router?: string
      body: Body
      query: Query
}

interface ErrorServer extends Error {
      code?: number
      detail?: string
      metadata: any
}

namespace Http {
      export type ResSucess = {
            code?: number
            message?: string
            metadata: any
      }

      export type ResError = {
            code?: number
            message?: string
            metadata: string | any
      }
}

namespace Token {
      export type Key = {
            public_key: string
            private_key: string
      }

      export type PairToken = {
            access_token: string
            refresh_token: string
      }

      export type PayloadJWT = {
            _id: Types.ObjectId
            user_email: string
            user_roles: string
      }
}

namespace InputCore {
      export type InputCommon = {
            input_title: string
            _id: Types.ObjectId
      }

      type InputSettingTextCommon = {
            minLength: number
            maxLength: number
            placeholder?: string
      } & InputSettingCommon

      type InputSettingCommon = {
            _id: Types.ObjectId
            input_color: string
            input_size: number
            input_style: string
            input_error: string
            input_error_state: boolean
            require: boolean
      }

      type InputSettingOption = InputSettingCommon
      namespace InputEmail {
            export interface InputTypeEmail extends InputCore.InputCommon {
                  type: 'EMAIL'
                  input_value: string
                  core: Core.Text
            }

            export interface InputEmailSender extends InputTypeEmail {
                  input_value: string
            }
      }

      namespace InputText {
            export type InputText = 'TEXT'
            export type InputTypeText = InputCore.InputCommon & {
                  type: InputText
                  core: Core.Text
            }
      }

      namespace InputOption {
            type InputOption = 'OPTION'

            type InputTypeOption = InputCore.InputCommon & {
                  type: InputOption
                  core: Core.Option
            }
      }

      namespace InputOptionMultiple {
            export type InputTypeOptionMultiple = InputCore.InputCommon & { type: 'OPTION_MULTIPLE'; core: Core.Option }
      }

      namespace InputVote {
            type InputVote = 'VOTE'

            type InputTypeVote = InputCore.InputCommon & {
                  type: InputVote
                  core: Core.Vote
            }
      }

      namespace InputVote {
            type InputVote = 'VOTE'

            type InputTypeVote = InputCore.InputCommon & {
                  type: InputVote
                  core: Core.Vote
            }
      }

      namespace InputPhone {
            type InputPhone = 'PHONE'

            type InputTypePhone = InputCore.InputCommon & {
                  type: InputPhone
                  core: Core.Phone
            }
      }

      namespace InputDate {
            type InputDate = 'DATE'

            type InputTypeDate = InputCore.InputCommon & {
                  type: InputDate
                  core: Core.Date
            }
      }

      namespace InputImage {
            type InputImage = 'FILE_IMAGE'

            type InputTypeImage = InputCore.InputCommon & {
                  type: InputImage
                  core: Core.Image
            }
      }

      namespace InputAddress {
            type InputAddress = 'ADDRESS'

            type InputTypeAddress = InputCore.InputCommon & {
                  type: InputAddress
                  core: Core.Address
            }
      }

      namespace InputAnchor {
            type InputAnchor = 'ANCHOR'

            type InputTypeAnchor = InputCore.InputCommon & {
                  type: InputAnchor
                  core: Core.Anchor
            }
      }

      type InputForm =
            | InputText.InputTypeText
            | InputEmail.InputTypeEmail
            | InputVote.InputTypeVote
            | InputOption.InputTypeOption
            | InputPhone.InputTypePhone
            | InputDate.InputTypeDate
            | InputOptionMultiple.InputTypeOptionMultiple
            | InputImage.InputTypeImage
            | InputAddress.InputTypeAddress
            | InputAnchor.InputTypeAnchor
}

namespace Core {
      type CoreCommon = Text | Option | Vote

      type Setting = {
            input_color: string
            input_size: number
            input_style: string
            input_error_state: boolean
            input_error: string
            require: boolean
      }

      type Text = {
            setting: Core.Setting & {
                  minLength: number
                  maxLength: number
                  placeholder?: string
            }
      }

      type Option = { setting: Core.Setting; options: { option_id: string; option_value: string }[] }
      type Vote = { setting: Core.Setting }
      type Phone = { setting: Core.Setting }
      type Date = { setting: Core.Setting }
      type Image = { setting: Core.Setting }
      type Address = { setting: Core.Setting }
      type Anchor = { setting: Core.Setting }
}

namespace UpdateAccount {
      export type UpdateEmailParams = {
            user_password: string
            user_new_email: string
      }

      export type UpdatePasswordParams = {
            password: string
            new_password: string
      }
}

namespace FormEdit {
      export type FormEditParams = {
            form: FormSchema & { _id: string; input_id: string }
      }

      export type FindFormParams = {
            form_id: string
      }
}

namespace Form {
      type FormCore = FormSchema & { _id: Types.ObjectId }
      namespace FormAnswer {
            type InputFormRequire = { _id?: string; title?: string; checkRequire: boolean }
            type InputFormData = {
                  one_answer_id: Types.ObjectId
                  _id: Types.ObjectId | string
                  title: string
                  mode: 'Require' | 'Optional'
                  value: string
                  type: 'TEXT' | 'EMAIL' | 'IMAGE' | 'OPTION' | 'OPTION_MULTIPLE' | 'PHONE' | 'VOTE'
                  description: any
            }

            type TFormAnswer = {
                  form_id: Types.ObjectId
                  form_answer_state: 'Done' | 'Temp'
                  answers: InputFormData[]
                  create_time: Date
                  expireAt?: Date
                  _id?: Types.ObjectId
            }

            type FormAnswerOrigin = {
                  form_id: Types.ObjectId
                  owner_id: Types.ObjectId
                  reports: TFormAnswer[]
            }
      }

      namespace FormTitle {
            namespace Common {
                  type Type = 'Text' | 'Image' | 'FullDescription'
                  type Core = Text.Core['core'] | Image.Core['core'] | FullDescription.Core['core']
                  type FormTilteCommon = {
                        _id: Types.ObjectId
                        type: Type
                        form_id: Types.ObjectId
                  }
            }

            namespace Text {
                  type Core = Common.FormTilteCommon & {
                        type: 'Text'
                        core: {
                              value: string
                        }
                  }
            }

            namespace Image {
                  type Core = Common.FormTilteCommon & {
                        type: 'Image'
                        core: {
                              url: string
                        }
                  }
            }

            namespace FullDescription {
                  type Core = Common.FormTilteCommon & {
                        type: 'FullDescription'
                        core: {
                              header_value: string
                              value: string
                        }
                  }
            }

            type FormTitleBase = Text.Core | Image.Core | FullDescription.Core
      }
}

namespace Notification {
      namespace Type {
            type System = 'System'
            type FormAnswers = 'Form_Answers'
            type Account = 'Account'

            type Common = System | FormAnswers | Account
      }

      namespace Core {
            type System = {
                  message: string
            }

            type FormAnswers = {
                  message: string
                  form_id: string
                  form_answer_id: string
                  create_time: string
            }

            type Account = {
                  message: string
            }

            type Common = System | FormAnswers | Account
      }

      namespace System {
            type NotificationSystem = Notification.Commom.TCommon & {
                  type: Type.System
                  core: Core.System
            }
      }

      namespace Account {
            type NotificationAccount = Notification.Commom.TCommon & {
                  type: Type.Account
                  core: Core.Account
            }
      }

      namespace FormAnswers {
            type NotificationFormAnswers = Notification.Commom.TCommon & {
                  type: Type.FormAnswers
                  core: Core.FormAnswers
            }
      }

      namespace Commom {
            type TCommon = {
                  _id: Types.ObjectId
                  create_time: Date
            }
      }

      type NotifcationCore = System.NotificationSystem | Account.NotificationAccount | FormAnswers.NotificationFormAnswers
}

namespace OAuth {
      namespace Google {
            type GoogleUserData = {
                  id: string
                  email: string
                  verified_email: boolean
                  name: string
                  given_name: string
                  family_name: string
                  picture: string
            }
      }

      namespace Github {
            type GithubUserData = {
                  login: string
                  id: number
                  node_id: string
                  avatar_url: string
                  gravatar_id: string
                  url: string
                  html_url: string
                  followers_url: string
                  following_url: string
                  gists_url: string
                  starred_url: string
                  subscriptions_url: string
                  organizations_url: string
                  repos_url: string
                  events_url: string
                  received_events_url: string
                  type: string
                  site_admin: boolean
                  name: string
                  company?: any
                  blog: string
                  location?: any
                  email?: any
                  hireable?: any
                  bio?: any
                  twitter_username?: any
                  public_repos: number
                  public_gists: number
                  followers: number
                  following: number
                  created_at: string
                  updated_at: string
            }

            type GetEmailData = {
                  email: string
                  primary: boolean
                  verified: boolean
                  visibility: string
            }
      }
}
