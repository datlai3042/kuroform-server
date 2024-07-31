import { NextFunction, Response } from 'express'
import { CREATE, OK } from '~/Core/response.success'
import NotificationService from '~/services/user/notification.service'
import { CustomRequest } from '~/type'

class NotificationController {
      static async getAllNotification(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await NotificationService.getAllNotification(req, res, next) }).send(res)
      }

      static async addNotificationSystem(req: CustomRequest, res: Response, next: NextFunction) {
            return new CREATE({ metadata: await NotificationService.addNotificationSystem(req, res, next) }).send(res)
      }

      static async addNotificationAccount(req: CustomRequest, res: Response, next: NextFunction) {
            return new CREATE({ metadata: await NotificationService.addNotificationAccount(req, res, next) }).send(res)
      }

      static async addNotificationFormAnswers(req: CustomRequest, res: Response, next: NextFunction) {
            return new CREATE({ metadata: await NotificationService.addNotificationFormAnswers(req, res, next) }).send(res)
      }

      static async getAllNotificationType(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await NotificationService.getAllNotificationType(req, res, next) }).send(res)
      }

      static async deleteNotificationItem(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await NotificationService.deleteNotificationItem(req, res, next) }).send(res)
      }
}

export default NotificationController
