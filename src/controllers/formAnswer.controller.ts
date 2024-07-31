import { NextFunction, Response } from 'express'
import { CREATE, OK } from '~/Core/response.success'
import FormAnswerService from '~/services/form/formAnswer.service'
import { CustomRequest } from '~/type'

class FormAnswerController {
      static async addAnswerForm(req: CustomRequest, res: Response, next: NextFunction) {
            return new CREATE({ metadata: await FormAnswerService.addAnswerForm(req, res, next) }).send(res)
      }

      static async getFormAnswer(req: CustomRequest, res: Response, next: NextFunction) {
            return new CREATE({ metadata: await FormAnswerService.getFormAnswer(req, res, next) }).send(res)
      }

      static async getTotalViewForm(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormAnswerService.getTotalViewForm(req, res, next) }).send(res)
      }

      static async getTotaLAnswerForm(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormAnswerService.getTotaLAnswerForm(req, res, next) }).send(res)
      }
      static async uploadFileFormAnswer(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormAnswerService.uploadFileFormAnswer(req, res, next) }).send(res)
      }

      static async increaseViewFormAnswer(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormAnswerService.increaseViewFormAnswer(req, res, next) }).send(res)
      }
}

export default FormAnswerController
