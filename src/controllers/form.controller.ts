import { NextFunction, Response } from 'express'
import { CREATE, OK } from '~/Core/response.success'
import FormService from '~/services/form/form.service'
import FormAnswerService from '~/services/form/formAnswer.service'
import FormInputService from '~/services/form/formInput.service'
import FormInput from '~/services/form/formInput.service'
import InputOptionService from '~/services/form/input_type/input_option.service'
import { CustomRequest } from '~/type'

class FormController {
      //GET
      static async createForm(req: CustomRequest, res: Response, next: NextFunction) {
            return new CREATE({ metadata: await FormService.createForm(req, res, next) }).send(res)
      }

      static async getAllForm(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.getAllForm(req, res, next) }).send(res)
      }

      static async getFormId(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.getFormId(req, res, next) }).send(res)
      }

      static async getForms(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.getForms(req, res, next) }).send(res)
      }

      static async getSearchForm(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.getSearchForm(req, res, next) }).send(res)
      }

      static async getFormPagination(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.getFormPagination(req, res, next) }).send(res)
      }

      static async getInfoFormNotification(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.getInfoFormNotification(req, res, next) }).send(res)
      }

      static async getFormUpdate(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.getFormUpdate(req, res, next) }).send(res)
      }

      static async getFormBaseOnDate(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.getFormBaseOnDate(req, res, next) }).send(res)
      }

      static async getFormGuess(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.getFormGuess(req, res, next) }).send(res)
      }

      static async getAllFormState(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.getAllFormState(req, res, next) }).send(res)
      }

      static async getListFormDelete(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.getListFormDelete(req, res, next) }).send(res)
      }

      static async changeModeDisplay(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.changeModeDisplay(req, res, next) }).send(res)
      }

      static async addInputAndSetTitle(req: CustomRequest, res: Response, next: NextFunction) {
            return new CREATE({ metadata: await FormInputService.addInputAndSetTitle(req, res, next) }).send(res)
      }

      static async addInput(req: CustomRequest, res: Response, next: NextFunction) {
            return new CREATE({ metadata: await FormInputService.addInput(req, res, next) }).send(res)
      }

      static async addInputToEnter(req: CustomRequest, res: Response, next: NextFunction) {
            return new CREATE({ metadata: await FormInputService.addInputToEnter(req, res, next) }).send(res)
      }

      //Thay đổi mode
      static async changeModeForm(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.changeModeForm(req, res, next) }).send(res)
      }

      static async setModeImageForm(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.setModeImageForm(req, res, next) }).send(res)
      }

      static async deleteFormId(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.deleteFormId(req, res, next) }).send(res)
      }

      static async deleteFormForever(req: CustomRequest, res: Response, next: NextFunction) {
            return new CREATE({ metadata: await FormService.deleteFormForever(req, res, next) }).send(res)
      }

      static async updateForm(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.updateForm(req, res, next) }).send(res)
      }

      //update title của form
      static async updateTitleInput(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormInputService.updateTitleInput(req, res, next) }).send(res)
      }

      static async addSubTitleItem(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.addSubTitleItem(req, res, next) }).send(res)
      }

      static async deleteSubTitleItem(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.deleteSubTitleItem(req, res, next) }).send(res)
      }

      static async updateTitleSubText(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.updateTitleSubText(req, res, next) }).send(res)
      }

      static async updateSubTitleDescription(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.updateSubTitleDescription(req, res, next) }).send(res)
      }

      static async addInputToTitle(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.addInputToTitle(req, res, next) }).send(res)
      }

      static async setTitleForm(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.setTitleForm(req, res, next) }).send(res)
      }

      //form image

      static async uploadTitleImage(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.uploadTitleImage(req, res, next) }).send(res)
      }

      static async addAvatar(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.addAvatar(req, res, next) }).send(res)
      }

      static async addBackground(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.addBackground(req, res, next) }).send(res)
      }

      static async uploadAvatar(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.uploadAvatar(req, res, next) }).send(res)
      }

      static async uploadCover(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.uploadCover(req, res, next) }).send(res)
      }

      static async deleteAvatar(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.deleteAvatar(req, res, next) }).send(res)
      }

      static async deleteCover(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.deleteCover(req, res, next) }).send(res)
      }

      //Liên quan đến các input
      static async updateInputItem(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.updateInputItem(req, res, next) }).send(res)
      }

      static async deleteInputItem(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormService.deleteInputItem(req, res, next) }).send(res)
      }

      static async updateSettingInput(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormInputService.updateSettingInput(req, res, next) }).send(res)
      }

      static async changeInputType(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await FormInputService.changeInputType(req, res, next) }).send(res)
      }

      //INPUT - OPTION
      static async addOption(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await InputOptionService.addOption(req, res, next) }).send(res)
      }

      static async updatePositionOption(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await InputOptionService.updatePositionOption(req, res, next) }).send(res)
      }

      static async deleteOptionId(req: CustomRequest, res: Response, next: NextFunction) {
            return new OK({ metadata: await InputOptionService.deleteOptionId(req, res, next) }).send(res)
      }
}

export default FormController
