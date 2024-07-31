import { NextFunction, Response } from 'express'
import { OK } from '~/Core/response.success'
import AddressService from '~/services/common/address.service'
import { CustomRequest } from '~/type'

class AddressController {
      static async getAllProvinces(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await AddressService.getAllProvinces(req, res, next) }).send(res)
      }

      static async getDistrictWithPattern(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await AddressService.getDistrictWithPattern(req, res, next) }).send(res)
      }

      static async getWardWithPattern(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await AddressService.getWardWithPattern(req, res, next) }).send(res)
      }
}

export default AddressController
