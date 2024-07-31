import { NextFunction, Response } from 'express'
import { CREATE, OK } from '~/Core/response.success'
import AccountService from '~/services/user/account.service'
import { CustomRequest } from '~/type'

class AccountController {
      static async me(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await AccountService.me(req, res, next) }).send(res)
      }

      static async createPassword(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await AccountService.createPassword(req, res, next) }).send(res)
      }

      static async updateAvatar(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await AccountService.updateAvatar(req, res, next) }).send(res)
      }

      static async updateEmail(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await AccountService.updateEmail(req, res, next) }).send(res)
      }
      static async updatePassword(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await AccountService.updatePassword(req, res, next) }).send(res)
      }
}

export default AccountController
