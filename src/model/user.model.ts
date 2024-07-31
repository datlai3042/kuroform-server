import { Document, Schema, Types, model } from 'mongoose'

const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'users'

type Gender = 'MALE' | 'FEMALE' | 'OTHER'
type Clondinary = {
      secure_url: string
      public_id: string
}

type UserRole = 'USER' | 'ADMIN' | 'GUEST'

type UserAvatar = string

type UserAuth = 'email' | 'oAuth'

export type UserSchema = {
      _id: Types.ObjectId
      user_email: string
      user_password: string
      user_first_name: string
      user_last_name: string
      user_birthday: Date
      user_gender: Gender
      user_roles: UserRole
      user_avatar_system: string
      user_avatar_current: UserAvatar
      user_avater_used: UserAvatar[]
      user_auth: UserAuth
      user_create_password: boolean
      user_password_state: boolean
      user_atlas: string
}

export type UserDocument = Document & UserSchema

export const userSchema = new Schema<UserDocument>(
      {
            user_email: { type: String, required: true },
            user_password: { type: String, required: true },
            user_first_name: { type: String, required: true },
            user_atlas: { type: String, required: true },
            user_create_password: { type: Boolean, default: false },
            user_last_name: { type: String, required: true },
            user_birthday: { type: Date },
            user_gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'], default: 'MALE', required: true },
            user_roles: { type: String, enum: ['USER', 'ADMIN', 'GUEST'], default: 'USER', required: true },
            user_avatar_system: { type: String, default: '123', required: true },
            user_avatar_current: { type: String },
            user_password_state: { type: Boolean, default: false, required: true },
            user_auth: { type: String, enum: ['email', 'oAuth'], default: 'email' },
            user_avater_used: {
                  type: [
                        {
                              secure_url: String,
                              public_id: String,
                              date: Date
                        }
                  ],
                  default: []
            }
      },
      { collection: COLLECTION_NAME, timestamps: true }
)

const userModel = model<UserSchema>(DOCUMENT_NAME, userSchema)

export default userModel
