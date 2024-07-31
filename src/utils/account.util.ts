import { Types } from 'mongoose'
import userModel from '~/model/user.model'

export const updateUserCommon = async ({ user_id, update_query }: { user_id: Types.ObjectId; update_query: Object }) => {
      const userQueryDoc = { _id: user_id }

      const userOptionDoc = { new: true, upsert: true }

      const userUpdate = await userModel.findOneAndUpdate(userQueryDoc, update_query, userOptionDoc)

      return { user: userUpdate }
}
