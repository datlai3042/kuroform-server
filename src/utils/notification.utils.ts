import { Types } from 'mongoose'
import { notificationUserModel } from '~/model/notification.model'

export const updateNotificationCommon = async ({ notification_user_id, update_query }: { notification_user_id: Types.ObjectId; update_query: Object }) => {
      const notification_user_query = { notification_user_id }
      const notification_options = { new: true, upsert: true }

      const notificationUpdate = await notificationUserModel.findOneAndUpdate(notification_user_query, update_query, notification_options)

      return { notifications: notificationUpdate }
}
