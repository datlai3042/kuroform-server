import { Router } from 'express'
import NotificationController from '~/controllers/notification.controller'
import { asyncHandler } from '~/helpers/asyncHandler'
import authentication from '~/middlewares/authentication'

const routerNotification = Router()

routerNotification.use(authentication)
routerNotification.get('/get-all-notification', asyncHandler(NotificationController.getAllNotification))
routerNotification.get('/get-notification-type', asyncHandler(NotificationController.getAllNotificationType))
routerNotification.post('/add-a-notification-system', asyncHandler(NotificationController.addNotificationSystem))
routerNotification.post('/add-a-notification-account', asyncHandler(NotificationController.addNotificationAccount))
routerNotification.post('/add-a-notification-form-answers', asyncHandler(NotificationController.addNotificationFormAnswers))
routerNotification.delete('/delete-notification-item', asyncHandler(NotificationController.deleteNotificationItem))

export default routerNotification
