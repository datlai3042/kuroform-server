import { NextFunction, Response } from 'express'
import { district } from '~/constants/district'
import { provinces } from '~/constants/provinces'
import { ward } from '~/constants/ward'
import { CustomRequest } from '~/type'

class AddressService {
      static async getAllProvinces(req: CustomRequest, res: Response, next: NextFunction) {
            return { provinces }
      }

      static async getDistrictWithPattern(req: CustomRequest<object, { province_code: string }>, res: Response, next: NextFunction) {
            const { province_code } = req.query
            const districtOfProvinces = district.filter((district_item) => {
                  if (district_item['parent_code'] === province_code) return district_item
            })
            return { districts: districtOfProvinces }
      }

      static async getWardWithPattern(req: CustomRequest<object, { district_code: string }>, res: Response, next: NextFunction) {
            const { district_code } = req.query
            const wardOfDistricts = ward.filter((ward_item) => {
                  if (ward_item['parent_code'] === district_code) return ward_item
            })
            return { wards: wardOfDistricts }
      }
}

export default AddressService
