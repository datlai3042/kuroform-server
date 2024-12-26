import { NextFunction, Response } from 'express'
import { Types } from 'mongoose'
import { BadRequestError } from '~/Core/response.error'
import cloudinary from '~/configs/cloudinary.config'
import { inputSettingText } from '~/constants/input.constants'
import formModel, { FormModeDisplay, FormSchema, FormState } from '~/model/form.model'
import formAnswerModel, { oneAnswer } from '~/model/formAnswer.model'
import { formTitleSubModel, generateCoreImageObject, generateCoreTextObject, generateSubTitleType } from '~/model/form_title.model'
import { inputModel } from '~/model/input.model'
import { notificationUserModel } from '~/model/notification.model'
import { UserDocument } from '~/model/user.model'
import { CustomRequest, Form, FormEdit, InputCore, Notification } from '~/type'
import { foundForm, renderCountFormState, updateFormCommon, updateFormCommonSub } from '~/utils/form.utils'
import createANotification from '~/utils/notification'
import uploadToCloudinary from '~/utils/upload.cloudinary'

class FormService {
      //GET Thông tin FORM
      static async createForm(req: CustomRequest, res: Response, next: NextFunction) {
            const { user } = req
            const formQuery = { form_owner: user?._id }
            const form = await formModel.create(formQuery)
            if (!form) throw new BadRequestError({ metadata: 'Tạo Form thất bại' })
            await createANotification({ user_id: (user as UserDocument)?._id, type: 'System', core: { message: 'Bạn đã tạo một Form' } })

            return { form_id: await form._id }
      }

      static async getForms(req: CustomRequest, res: Response, next: NextFunction) {
            const { user } = req
            const forms = await formModel.find({ form_owner: new Types.ObjectId(user?._id) })
            return { forms }
      }

      static async getAllForm(req: CustomRequest, res: Response, next: NextFunction) {
            const forms = await formModel.find()
            return { forms }
      }

      static async getSearchForm(req: CustomRequest<object, { text: string }>, res: Response, next: NextFunction) {
            const { user } = req
            const { text } = req.query
            const formQuery = { form_owner: user?._id }
            const forms = await formModel
                  .find(formQuery)
                  .find({ $text: { $search: text as string } })
                  .skip(0)
                  .limit(10)

            if (!forms) throw new BadRequestError({ metadata: 'Tạo Form thất bại' })
            return { forms }
      }

      static async getListFormDelete(req: CustomRequest, res: Response, next: NextFunction) {
            const { user } = req
            const forms = await formModel.find({ form_owner: user?._id, form_state: 'isDelete' })
            return { forms }
      }

      static async getFormId(req: CustomRequest<object, { form_id: string }>, res: Response, next: NextFunction) {
            const { form_id } = req.query
            if (form_id.length < 24) {
                  return { form: null }
            }
            const { user } = req
            const form = await formModel.findOne({ _id: new Types.ObjectId(form_id), form_owner: user?._id }).populate('form_title.form_title_sub')

            return { form: form ? form : null }
      }

      static async getFormPagination(req: CustomRequest<object, { page: number; limit: number }>, res: Response, next: NextFunction) {
            const { user } = req
            const { page, limit } = req.query

            const _skip = (page - 1) * limit
            const _limit = limit

            const total_document = await formModel.find({ form_owner: user?._id, form_state: { $ne: 'isDelete' } })
            const total_page = Math.ceil(total_document.length / limit)
            const forms = await formModel
                  .find({ form_owner: user?._id, form_state: { $ne: 'isDelete' } })
                  .limit(_limit)
                  .skip(_skip)
            return { forms, total_page: total_page }
      }

      static async getInfoFormNotification(
            req: CustomRequest<object, { form_id: string; notification_id: Types.ObjectId }>,
            res: Response,
            next: NextFunction
      ) {
            const { form_id } = req.query
            const { user } = req
            const form = await formModel
                  .findOne({ _id: new Types.ObjectId(form_id), form_owner: user?._id })
                  .select('form_title form_avatar form_setting_default')

            return { form: form ? form : null }
      }

      static async getFormUpdate(req: CustomRequest<FormEdit.FindFormParams>, res: Response, next: NextFunction) {
            const { user } = req
            const { form_id } = req.body

            if (form_id.length < 24) {
                  return { form: null }
            }
            const formQuery = { form_owner: user?._id, _id: new Types.ObjectId(form_id) }
            const form = await formModel.findOne(formQuery)
            if (!form) throw new BadRequestError({ metadata: 'Tạo Form thất bại' })
            return { form }
      }

      static async getFormGuess(req: CustomRequest<object, { form_id: string }>, res: Response, next: NextFunction) {
            const { form_id } = req.query

            if (form_id.length < 24) {
                  return { form: null }
            }
            const formQuery = { _id: new Types.ObjectId(form_id), form_state: { $eq: 'isPublic' } }
            const form = await formModel.findOne(formQuery)
            if (!form) {
                  return { form: null }
            }
            const form_answer_id = await oneAnswer.create({ form_id })

            return { form: form, form_answer_id: form_answer_id._id }
      }

      static async getFormBaseOnDate(req: CustomRequest<object, { date_begin: string; date_over: string }>, res: Response, next: NextFunction) {
            const { date_begin, date_over } = req.query
            const { user } = req
            const formQuery = { form_owner: user?._id, createdAt: { $gte: date_begin, $lte: date_over } }
            const form = await formModel.find(formQuery).sort({
                  createdAt: 1
            })
            return { results: form, date_begin, date_over }
      }

      static async getAllFormState(req: CustomRequest, res: Response, next: NextFunction) {
            const { user } = req

            const { formPublic, formDelete, formPrivate } = await renderCountFormState({ user: user as UserDocument })

            return { formPublic, formPrivate, formDelete }
      }

      //DELETE FORM
      static async deleteFormId(req: CustomRequest<object, { form_id: Types.ObjectId }>, res: Response, next: NextFunction) {
            const { form_id } = req.query
            const { user } = req

            if (form_id.toString().length < 24) {
                  return { form: null }
            }

            const { form } = await updateFormCommon({ form_id, user_id: user?._id as Types.ObjectId, update_query: { $set: { form_state: 'isDelete' } } })

            const { formPublic, formDelete, formPrivate } = await renderCountFormState({ user: user as UserDocument })

            return { form: form, formPublic, formDelete, formPrivate }
      }

      static async deleteFormForever(req: CustomRequest<object, { form_id: Types.ObjectId }>, res: Response, next: NextFunction) {
            const { user } = req
            const { form_id } = req.query

            const formQuery = { _id: form_id, form_owner: user?._id }
            const formTitleSubQuery = { form_id: form_id }

            const options = { new: true, upsert: true }

            //xoa cac models lien quan
            await formModel.findOneAndDelete(formQuery, options)
            await formTitleSubModel.findOneAndDelete(formTitleSubQuery, options)
            await oneAnswer.findOneAndDelete(formTitleSubQuery, options)
            await formAnswerModel.findOneAndDelete(formTitleSubQuery, options)

            const found_notification_user = { notification_user_id: user?._id }

            await createANotification({
                  user_id: (user as UserDocument)?._id,
                  type: 'System',
                  core: { message: 'Đã xóa vĩnh viễn một form' }
            })

            const notification_user = await notificationUserModel.findOne(found_notification_user)
            notification_user!.notifications = notification_user?.notifications.filter((notification) => {
                  if (notification.type === 'Form_Answers' && notification.core.form_id == form_id.toString()) {
                        return null
                  }
                  return notification
            }) as Notification.NotifcationCore[]

            notification_user?.save()

            return { message: 'Xóa thành công' }
      }

      //UPDATE FORM HIỂN THỊ
      static async changeModeForm(req: CustomRequest<{ mode: FormState; form_id: Types.ObjectId }>, res: Response, next: NextFunction) {
            const { user } = req
            const { form_id, mode } = req.body
            //update

            const { form } = await updateFormCommon({ form_id, user_id: user?._id as Types.ObjectId, update_query: { $set: { form_state: mode } } })

            return { form }
      }

      static async changeModeDisplay(req: CustomRequest<{ mode: FormModeDisplay; form_id: Types.ObjectId }>, res: Response, next: NextFunction) {
            const { user } = req
            const { form_id, mode } = req.body
            //update

            const { form } = await updateFormCommon({ form_id, user_id: user?._id as Types.ObjectId, update_query: { $set: { form_mode_display: mode } } })

            return { form }
      }

      static async setModeImageForm(req: CustomRequest<{ form_id: Types.ObjectId; mode: 'Slider' | 'Normal' }>, res: Response, next: NextFunction) {
            const { form_id, mode } = req.body
            const { user } = req

            const { form } = await updateFormCommon({
                  form_id,
                  user_id: user?._id as Types.ObjectId,
                  update_query: { $set: { 'form_title.form_title_mode_image': mode } }
            })

            return { form }
      }

      //UPDATE TIÊU ĐỀ FORM

      static async setTitleForm(req: CustomRequest<{ form_id: Types.ObjectId; value: string }>, res: Response, next: NextFunction) {
            const { form_id, value } = req.body
            const { user } = req

            const { form } = await updateFormCommon({
                  form_id,
                  user_id: user?._id as Types.ObjectId,
                  update_query: { $set: { 'form_title.form_title_value': value } }
            })

            return { form }
      }

      static async addSubTitleItem(
            req: CustomRequest<{ type: Form.FormTitle.FormTitleBase['type']; form_id: Types.ObjectId }>,
            res: Response,
            next: NextFunction
      ) {
            const { user } = req
            const { form_id, type } = req.body

            const core = generateSubTitleType({ type, form_id })

            const { form } = await updateFormCommon({
                  form_id,
                  user_id: user?._id as Types.ObjectId,
                  update_query: { $push: { 'form_title.form_title_sub': core } }
            })

            return { form }
      }

      static async deleteSubTitleItem(
            req: CustomRequest<object, { title_sub_id: Types.ObjectId; form_id: Types.ObjectId }>,
            res: Response,
            next: NextFunction
      ) {
            const { user } = req
            const { form_id, title_sub_id } = req.query

            const { form } = await updateFormCommonSub({
                  form_id,
                  user_id: user?._id as Types.ObjectId,
                  sub_query: { 'form_title.form_title_sub._id': title_sub_id },
                  update_query: { $pull: { 'form_title.form_title_sub': { _id: title_sub_id } } }
            })

            return { form }
      }

      static async uploadTitleImage(req: CustomRequest<{ form_id: Types.ObjectId; titleSubId: Types.ObjectId }>, res: Response, next: NextFunction) {
            const file = req.file
            const { form_id, titleSubId } = req.body
            const { user } = req
            if (!file) throw new BadRequestError({ metadata: 'Missing File' })

            const formOrigin = await foundForm({ form_id, user_id: (user as UserDocument)?._id })
            const folder = `${process.env.CLOUDINARY_FOLDER_PREFIX}/users/user_id_${user?.id}/form_id_${formOrigin._id}/title/images`
            const result = await uploadToCloudinary(req?.file as Express.Multer.File, folder)

            const core = generateCoreImageObject({ url: result.secure_url })
            const { form } = await updateFormCommonSub({
                  form_id,
                  user_id: user?._id as Types.ObjectId,
                  sub_query: { 'form_title.form_title_sub._id': titleSubId },
                  update_query: { $set: { 'form_title.form_title_sub.$.core': core } }
            })

            return { form }
      }

      static async updateTitleSubText(
            req: CustomRequest<{ form_title_sub_id: Types.ObjectId; form_title_sub_content: string; form_id: Types.ObjectId }>,
            res: Response,
            next: NextFunction
      ) {
            const { user } = req
            const { form_id, form_title_sub_content, form_title_sub_id } = req.body

            const core = generateCoreTextObject({ value: form_title_sub_content })

            const { form } = await updateFormCommonSub({
                  form_id,
                  user_id: user?._id as Types.ObjectId,
                  sub_query: { 'form_title.form_title_sub._id': form_title_sub_id },
                  update_query: { $set: { 'form_title.form_title_sub.$.core': core } }
            })

            return { form }
      }

      static async updateSubTitleDescription(
            req: CustomRequest<{ header_value: string; value: string; title_sub_id: Types.ObjectId; form_id: Types.ObjectId }>,
            res: Response,
            next: NextFunction
      ) {
            const { user } = req
            const { header_value, value, title_sub_id, form_id } = req.body

            const core = { header_value, value }

            const { form } = await updateFormCommonSub({
                  form_id,
                  user_id: user?._id as Types.ObjectId,
                  sub_query: { 'form_title.form_title_sub._id': title_sub_id },
                  update_query: { $set: { 'form_title.form_title_sub.$.core': core } }
            })

            return { form }
      }

      static async addInputToTitle(req: CustomRequest<{ form: Form.FormCore }>, res: Response, next: NextFunction) {
            const { user } = req
            const { form } = req.body

            const newInput = await inputModel.create({ core: { setting: inputSettingText }, type: 'TEXT' })

            const { form: formUpdate } = await updateFormCommon({
                  form_id: new Types.ObjectId(form._id),
                  user_id: user?._id as Types.ObjectId,
                  update_query: { $push: { form_inputs: newInput } }
            })

            return { form: formUpdate }
      }

      static async updateForm(req: CustomRequest<FormEdit.FormEditParams & { inputItem: InputCore.InputForm }>, res: Response, next: NextFunction) {
            const { user } = req
            const { form } = req.body
            const formQueryDoc = { form_owner: user?._id, _id: new Types.ObjectId(form._id) }
            const formUpdateDoc = {
                  $set: {
                        form_title: form.form_title,
                        form_setting_default: form.form_setting_default,
                        form_background: form.form_background,
                        form_avatar: form.form_avatar,
                        form_state: form.form_state,
                        form_inputs: form.form_inputs,
                        form_mode_display: form.form_mode_display,
                        form_color: form.form_color,
                        form_button_text: form.form_button_text
                  }
            }
            const formOptionDoc = { new: true, upsert: true }

            const formUpdate = await formModel.findOneAndUpdate(formQueryDoc, formUpdateDoc, formOptionDoc)

            if (!formUpdate) throw new BadRequestError({ metadata: 'update form failure' })

            return { form: formUpdate }
      }

      // UPDATE IMAGE CỦA FORM
      static async addAvatar(req: CustomRequest<{ form: FormSchema & { _id: Types.ObjectId } }>, res: Response, next: NextFunction) {
            const { form } = req.body
            const { user } = req

            const { form: formUpdate } = await updateFormCommon({
                  form_id: new Types.ObjectId(form._id),
                  user_id: user?._id as Types.ObjectId,
                  update_query: { $set: { form_avatar_state: true, form_avatar: { mode: 'circle', position: 'left' } } }
            })

            return { form: formUpdate }
      }

      static async addBackground(req: CustomRequest<{ form: FormSchema & { _id: Types.ObjectId } }>, res: Response, next: NextFunction) {
            const { form } = req.body
            const { user } = req

            const { form: formUpdate } = await updateFormCommon({
                  form_id: new Types.ObjectId(form._id),
                  user_id: user?._id as Types.ObjectId,
                  update_query: { $set: { form_background_state: true, form_background: { mode_show: 'cover' } } }
            })

            return { form: formUpdate }
      }

      static async uploadAvatar(req: CustomRequest<{ form_id: Types.ObjectId }>, res: Response, next: NextFunction) {
            const file = req.file
            const { form_id } = req.body
            const { user } = req
            if (!file) throw new BadRequestError({ metadata: 'Missing File' })
            const formOrigin = await foundForm({ form_id, user_id: (user as UserDocument)?._id })

            const folder = `${process.env.CLOUDINARY_FOLDER_PREFIX}/users/user_id_${user?.id}/form_id_${formOrigin._id}/avatar`
            const result = await uploadToCloudinary(req?.file as Express.Multer.File, folder)

            const form_avatar = { form_avatar_url: result.secure_url, form_avatar_publicId: result.public_id }

            const { form } = await updateFormCommon({
                  form_id: form_id,
                  user_id: user?._id as Types.ObjectId,
                  update_query: { $set: { form_avatar, form_avatar_state: true } }
            })

            return { form }
      }

      static async deleteAvatar(req: CustomRequest<{ form_id: Types.ObjectId; mode: 'Image' | 'NoFile' }>, res: Response, next: NextFunction) {
            const { form_id, mode } = req.body
            const { user } = req

            const form = await foundForm({ form_id, user_id: (user as UserDocument)?._id })

            if (mode === 'Image') {
                  if (form && form.form_avatar) {
                        await cloudinary.uploader.destroy(form.form_avatar.form_avatar_publicId)
                  }
            }

            const { form: formUpdate } = await updateFormCommon({
                  form_id: form_id,
                  user_id: user?._id as Types.ObjectId,
                  update_query: { $unset: { form_avatar: 1 }, $set: { form_avatar_state: false } }
            })

            return { form: formUpdate }
      }

      static async uploadCover(req: CustomRequest<{ form_id: Types.ObjectId }>, res: Response, next: NextFunction) {
            const file = req.file
            const { form_id } = req.body
            const { user } = req
            if (!file) throw new BadRequestError({ metadata: 'Missing File' })

            const formOrigin = await formModel.findOne({ _id: new Types.ObjectId(form_id) })

            const folder = `${process.env.CLOUDINARY_FOLDER_PREFIX}/users/user_id_${user?.id}/form_id_${formOrigin?._id}/background`
            const result = await uploadToCloudinary(req?.file as Express.Multer.File, folder)

            

            const form_cover = { form_background_iamge_url: result.secure_url, form_backround_image_publicId: result.public_id }

            const { form } = await updateFormCommon({
                  form_id: form_id,
                  user_id: user?._id as Types.ObjectId,
                  update_query: { $set: { form_background: form_cover, form_background_state: true } }
            })

            return { form }
      }

      static async deleteCover(req: CustomRequest<{ form_id: Types.ObjectId }>, res: Response, next: NextFunction) {
            const { form_id } = req.body
            const { user } = req

            const formOrigin = await formModel.findOne({ _id: form_id })

            if (formOrigin && formOrigin.form_background?.form_background_iamge_url) {
                  await cloudinary.uploader.destroy(formOrigin.form_background.form_backround_image_publicId)
            }

            const { form } = await updateFormCommon({
                  form_id: form_id,
                  user_id: user?._id as Types.ObjectId,
                  update_query: { $unset: { form_background: 1 }, $set: { form_background_state: false } }
            })

            return { form }
      }

      static async updateInputItem(
            req: CustomRequest<{ form: FormSchema & { _id: Types.ObjectId }; newInput: InputCore.InputForm }>,
            res: Response,
            next: NextFunction
      ) {
            const { user } = req
            const { form, newInput } = req.body
            const { _id } = newInput

            const { form: formUpdate } = await updateFormCommonSub({
                  form_id: form._id,
                  user_id: user?._id as Types.ObjectId,
                  update_query: { 'form_inputs.$': newInput },
                  sub_query: { 'form_inputs._id': new Types.ObjectId(_id) }
            })

            return { form: formUpdate }
      }

      static async deleteInputItem(req: CustomRequest<{ form_id: Types.ObjectId; input_id: string }>, res: Response, next: NextFunction) {
            const { user } = req
            const { form_id, input_id } = req.body
            const formQueryDoc = { form_owner: user?._id, _id: form_id }

            const formUpdate = await formModel.findOne(formQueryDoc)

            const form_answer = await formAnswerModel.findOne({ form_id })
            if (form_answer) {
                  form_answer.reports = form_answer.reports.filter((answer) => {
                        const newArray = answer.answers.filter((ip) => {
                              if (ip._id.toString() === input_id) {
                                    return null
                              }
                              return ip
                        })
                        if (newArray.length === 0) {
                              return null
                        } else {
                              return { ...answer, answers: newArray, form_id: form_id }
                        }
                  })
                  await form_answer.save()
            }

            if (!formUpdate) throw new BadRequestError({ metadata: 'update form failure' })
            formUpdate.form_inputs = formUpdate.form_inputs.filter((input) => {
                  if (input._id?.toString() === input_id) {
                        return null
                  }
                  return input
            }) as Types.DocumentArray<InputCore.InputCommon[]>
            await formUpdate.save()

            return { form: formUpdate }
      }
}

export default FormService
