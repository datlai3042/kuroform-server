import { Schema, Types, model } from 'mongoose'
import { Notification } from '~/type'

const DOCUMENT_NAME = 'Notification'
const COLLECTION_NAME = 'notifications'

const notificationSchema = new Schema<Notification.NotifcationCore>(
      {
            type: { type: String, enum: ['System', 'Account', 'Form_Answers'], default: 'System' },
            core: { type: Schema.Types.Mixed, required: true },
            create_time: { type: Date, default: Date.now }
      },
      { collection: COLLECTION_NAME, timestamps: true }
)

export const notificationModel = model(DOCUMENT_NAME, notificationSchema)

const notificationUserSchema = new Schema<{ notification_user_id: Types.ObjectId; notifications: Notification.NotifcationCore[] }>(
      {
            notification_user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            notifications: [notificationSchema]
      },
      { collection: 'notification_user', timestamps: true }
)

export const notificationUserModel = model('Notification_User', notificationUserSchema)
