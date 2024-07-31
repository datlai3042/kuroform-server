import { NextFunction, Response } from 'express'
import { Types } from 'mongoose'
import { BadRequestError } from '~/Core/response.error'
import { notificationModel, notificationUserModel } from '~/model/notification.model'
import { CustomRequest, Notification } from '~/type'
import { updateNotificationCommon } from '~/utils/notification.utils'

class NotificationService {
      static async getAllNotification(req: CustomRequest, res: Response, next: NextFunction) {
            const { user } = req
            const notification_user_query = { notification_user_id: user?._id }
            const notifications = await notificationUserModel.findOne(notification_user_query)
            if (!notifications) {
                  return { notifications: [] }
            }
            notifications.notifications = notifications.notifications.sort((a, b) => b.create_time.getTime() - a.create_time.getTime())

            return { notification_user: notifications }
      }

      static async addNotificationSystem(req: CustomRequest<{ type: Notification.Type.Common; message: string }>, res: Response, next: NextFunction) {
            const { user } = req
            const { type = 'System', message } = req.body

            const notification = await notificationModel.create({ type, core: { message } })

            const notification_user_query = { notification_user_id: user?._id }
            const notification_user_update = { $push: { notifications: notification } }
            const notification_options = { new: true, upsert: true }

            const notificationCore = await notificationUserModel.findOneAndUpdate(notification_user_query, notification_user_update, notification_options)

            return { notifications: notificationCore }
      }

      static async addNotificationAccount(req: CustomRequest<{ type: Notification.Type.Common; message: string }>, res: Response, next: NextFunction) {
            const { user } = req
            const { type = 'Account', message } = req.body

            const notification = await notificationModel.create({ type, core: { message } })

            const { notifications } = await updateNotificationCommon({
                  notification_user_id: user?._id as Types.ObjectId,
                  update_query: { $push: { notifications: notification } }
            })
            return { notifications }
      }

      static async addNotificationFormAnswers(
            req: CustomRequest<{ type: Notification.Type.Common; core: Notification.Core.FormAnswers }>,
            res: Response,
            next: NextFunction
      ) {
            const { user } = req
            const { type = 'Form_Answers', core } = req.body

            const notification = await notificationModel.create({ type, core })

            const { notifications } = await updateNotificationCommon({
                  notification_user_id: user?._id as Types.ObjectId,
                  update_query: { $push: { notifications: notification } }
            })
            return { notifications }
      }

      static async getAllNotificationType(
            req: CustomRequest<object, { type: 'All' | Notification.Type.Common; page: number; limit: number }>,
            res: Response,
            next: NextFunction
      ) {
            const { user } = req
            const { type, page, limit } = req.query

            if (type === 'All') {
                  const notifications = await notificationUserModel.findOne({ notification_user_id: user?._id })

                  if (!notifications) return { notification_user: { notifications: [] } }
                  const START = (page - 1) * limit
                  const END = page * limit

                  notifications.notifications = notifications.notifications.slice(START, END)

                  notifications.notifications = notifications.notifications.sort((a, b) => b.create_time.getTime() - a.create_time.getTime())

                  return { notification_user: notifications }
            }

            const notifications = await notificationUserModel.findOne({ notification_user_id: user?._id, 'notifications.type': type })
            if (!notifications) return { notification_user: { notifications: [] } }

            notifications.notifications = notifications.notifications.filter((notification) => {
                  if (notification.type === type) return notification
                  return null
            })

            const START = (page - 1) * limit
            const END = page * limit

            notifications.notifications = notifications.notifications.slice(START, END)

            notifications.notifications = notifications.notifications.sort((a, b) => b.create_time.getTime() - a.create_time.getTime())

            return { notification_user: notifications }
      }

      static async deleteNotificationItem(req: CustomRequest<object, { notification_id: Types.ObjectId }>, res: Response, next: NextFunction) {
            const { user } = req
            const { notification_id } = req.query

            await notificationModel.findOneAndDelete({ _id: notification_id })

            const notification_user_query = { notification_user_id: user?._id }

            const notifications = await notificationUserModel.findOne(notification_user_query)

            notifications!.notifications = notifications?.notifications.filter((notification) => {
                  if (notification._id == notification_id) {
                        return null
                  }

                  return notification
            }) as Notification.NotifcationCore[]


            await notifications!.save()

            return { notification_user: notifications }
      }
}

export default NotificationService
