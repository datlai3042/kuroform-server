import { Router } from 'express'
import router from '..'
import { asyncHandler } from '~/helpers/asyncHandler'
import AddressController from '~/controllers/address.controller'

const routerAddress = Router()

routerAddress.get('/get-all-provinces', asyncHandler(AddressController.getAllProvinces))
routerAddress.get('/get-district-with-pattern', asyncHandler(AddressController.getDistrictWithPattern))
routerAddress.get('/get-ward-with-pattern', asyncHandler(AddressController.getWardWithPattern))

export default routerAddress
