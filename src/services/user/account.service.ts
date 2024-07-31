import { NextFunction, Response } from 'express'
import { Types } from 'mongoose'
import { BadRequestError } from '~/Core/response.error'
import { notificationUserModel } from '~/model/notification.model'
import userModel from '~/model/user.model'
import { CustomRequest, UpdateAccount } from '~/type'
import { updateUserCommon } from '~/utils/account.util'
import { compare, hassPassword } from '~/utils/bcrypt.utils'
import { expriresAT, omit, setCookieResponse } from '~/utils/dataResponse.utils'
import { validateEmail } from '~/utils/inputsValidate'
import createANotification from '~/utils/notification'
import uploadToCloudinary from '~/utils/upload.cloudinary'

class AccountService {
      static async me(req: CustomRequest, res: Response, next: NextFunction) {
            const { user } = req

            return { user }
      }

      static async createPassword(req: CustomRequest<{ password: string }>, res: Response, next: NextFunction) {
            const { user } = req
            const { password } = req.body

            if (user?.user_auth === 'oAuth' && user?.user_create_password) {
                  throw new BadRequestError({ metadata: 'API không phù hợp cho bạn' })
            }

            const hashPasswordNew = await hassPassword(password)

            const userUpdate = await userModel.findOneAndUpdate(
                  { _id: user?._id },
                  { $set: { user_password: hashPasswordNew, user_create_password: true } },
                  { new: true, upsert: true }
            )

            const createNotification = await createANotification({
                  user_id: user?._id as Types.ObjectId,
                  type: 'System',
                  core: {
                        message: `Tạo mật khẩu thành công`
                  }
            })

            return { user: omit(userUpdate.toObject(), ['user_password']) }
      }

      static async updateAvatar(req: CustomRequest, res: Response, next: NextFunction) {
            const user = req.user
            const file = req.file
            if (!file) throw new BadRequestError({ metadata: 'Missing File' })

            const folder = `${process.env.CLOUDINARY_FOLDER_PREFIX}/users/${user?.id}/avatar`
            const result = await uploadToCloudinary(req?.file as Express.Multer.File, folder)

            const { user: userUpdate } = await updateUserCommon({
                  user_id: user?._id as Types.ObjectId,
                  update_query: {
                        $set: { user_avatar_current: result.secure_url }
                  }
            })

            if (!userUpdate) throw new BadRequestError({ metadata: 'Lỗi không xác định' })

            return { message: 'Success', user: omit(userUpdate.toObject(), ['user_password']) }
      }

      static async updateEmail(req: CustomRequest<UpdateAccount.UpdateEmailParams>, res: Response, next: NextFunction) {
            const { user } = req

            const { user_new_email, user_password } = req.body

            const checkEmail = validateEmail(user_new_email)
            if (!checkEmail) throw new BadRequestError({ metadata: 'Email không hợp lệ' })

            const comparePassword = compare(user_password, user?.user_password as string)

            if (!comparePassword) throw new BadRequestError({ metadata: 'Password not match !!!' })

            const user_atlas = user_new_email.split('@')[0]

            const { user: userUpdate } = await updateUserCommon({
                  user_id: user?._id as Types.ObjectId,
                  update_query: {
                        $set: { user_email: user_new_email, user_atlas }
                  }
            })

            if (!userUpdate) throw new BadRequestError({ metadata: 'Unknown Error' })

            return { message: 'Success', user: omit(userUpdate.toObject(), ['user_password']) }
      }

      static async updatePassword(req: CustomRequest<UpdateAccount.UpdatePasswordParams>, res: Response, next: NextFunction) {
            const { user } = req

            const { password, new_password } = req.body

            const comparePassword = compare(password, user?.user_password as string)

            if (!comparePassword) throw new BadRequestError({ metadata: 'Password không đúng !!!' })

            const newHashPassword = await hassPassword(new_password)

            const { user: userUpdate } = await updateUserCommon({
                  user_id: user?._id as Types.ObjectId,
                  update_query: {
                        $set: { user_password: newHashPassword }
                  }
            })
            await createANotification({
                  user_id: user?._id as Types.ObjectId,

                  type: 'System',
                  core: {
                        message: `Cập nhập mật khẩu thành công`
                  }
            })

            if (!userUpdate) throw new BadRequestError({ metadata: 'Unknown Error' })

            return { message: 'Success', user: omit(userUpdate.toObject(), ['user_password']) }
      }
}

export default AccountService
