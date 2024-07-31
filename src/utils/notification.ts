import { Types } from 'mongoose'
import { notificationModel, notificationUserModel } from '~/model/notification.model'
import { Notification } from '~/type'

const createANotification = async ({
      user_id,
      type,
      core
}: {
      user_id: Types.ObjectId
      type: Notification.NotifcationCore['type']
      core: Notification.NotifcationCore['core']
}) => {
      const notification = await notificationModel.create({ type, core })

      const notification_user_query = { notification_user_id: user_id }
      const notification_user_update = { $push: { notifications: notification } }
      const notification_options = { new: true, upsert: true }

      const notificationCore = await notificationUserModel.findOneAndUpdate(notification_user_query, notification_user_update, notification_options)

      return { notifications: notificationCore, notification_item_id: notification._id }
}
export default createANotification
