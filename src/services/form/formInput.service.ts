import { NextFunction, Response } from 'express'
import { Types } from 'mongoose'
import { BadRequestError } from '~/Core/response.error'
import { generateInputSettingDefault, inputSettingOption, inputSettingText } from '~/constants/input.constants'
import formModel from '~/model/form.model'
import formAnswerCore from '~/model/formAnswer.model'
import { coreInputText, coreInputTextModel, inputModel } from '~/model/input.model'
import { Core, CustomRequest, Form, InputCore } from '~/type'
import { updateFormCommon, updateFormCommonSub } from '~/utils/form.utils'
import { generateInputSettingWithType } from '~/utils/input.utils'

class FormInputService {
      static async addInputAndSetTitle(req: CustomRequest<{ form: Form.FormCore; title: string }>, res: Response, next: NextFunction) {
            const { user } = req
            const { form, title } = req.body

            const newInput = { core: { setting: inputSettingText }, type: 'TEXT' }

            const formTitle = { ...form.form_title, form_title_value: title }

            const newForm = await formModel.findOneAndUpdate(
                  { _id: form._id, form_owner: user?._id },
                  { $push: { form_inputs: newInput }, $set: { form_title: formTitle } },
                  { new: true, upsert: true }
            )

            const { form: formUpdate } = await updateFormCommon({
                  form_id: new Types.ObjectId(form._id),
                  user_id: user?._id as Types.ObjectId,

                  update_query: { $push: { form_inputs: newInput }, $set: { form_title: formTitle } }
            })

            return { form: newForm }
      }

      static async updateTitleInput(
            req: CustomRequest<{ input_title_value: string; input_id: Types.ObjectId; form: Form.FormCore }>,
            res: Response,
            next: NextFunction
      ) {
            const { user } = req
            const { form, input_id, input_title_value } = req.body

            const { form: formUpdate } = await updateFormCommonSub({
                  form_id: form._id,
                  user_id: user?._id as Types.ObjectId,
                  sub_query: {
                        'form_inputs._id': input_id
                  },
                  update_query: {
                        'form_inputs.$.input_title': input_title_value
                  }
            })

            const form_answers = await formAnswerCore.findOne({ form_id: new Types.ObjectId(form._id) })
            form_answers?.reports.map((rp) => {
                  return rp.answers.map((ans) => {
                        if (ans._id == input_id) {
                              ans.title = input_title_value
                              return ans
                        }
                        return ans
                  })
            })

            await form_answers?.save()

            return { form: formUpdate }
      }

      static async updateSettingInput(
            req: CustomRequest<{
                  form: Form.FormCore
                  input_id: Types.ObjectId
                  input_id_setting: InputCore.InputSettingTextCommon
            }>,
            res: Response,
            next: NextFunction
      ) {
            const { user } = req
            const { form, input_id, input_id_setting } = req.body

            const { form: formUpdate } = await updateFormCommonSub({
                  form_id: form._id,
                  user_id: user?._id as Types.ObjectId,
                  sub_query: {
                        'form_inputs._id': input_id
                  },
                  update_query: {
                        $set: {
                              'form_inputs.$.core.setting': input_id_setting
                        }
                  }
            })

            if (!formUpdate) throw new BadRequestError({ metadata: 'update form failure' })

            return { form: formUpdate }
      }

      static async addInput(req: CustomRequest<{ form_id: Types.ObjectId }>, res: Response, next: NextFunction) {
            const { user } = req
            const { form_id } = req.body
            const newInput = await inputModel.create({ core: { setting: inputSettingText }, type: 'TEXT' })

            const { form } = await updateFormCommon({ form_id, user_id: user?._id as Types.ObjectId, update_query: { $push: { form_inputs: newInput } } })

            return { form }
      }

      static async addInputToEnter(
            req: CustomRequest<{ form: Form.FormCore; input_id_target: Types.ObjectId; setting: typeof inputSettingText }>,
            res: Response,
            next: NextFunction
      ) {
            const { user } = req
            const { form, input_id_target, setting } = req.body

            const indexInputCurrentEvent = form.form_inputs.findIndex((ip) => ip._id === input_id_target)

            const newInput = await inputModel.create({ core: { setting }, type: 'TEXT' })
            form.form_inputs.splice(indexInputCurrentEvent + 1, 0, newInput.toObject())

            const { form: formUpdate } = await updateFormCommon({
                  form_id: form._id,
                  user_id: user?._id as Types.ObjectId,
                  update_query: { $set: { form_inputs: form.form_inputs } }
            })

            return { form: formUpdate }
      }

      static async changeInputType(
            req: CustomRequest<{ form: Form.FormCore; inputItem: InputCore.InputForm; type: InputCore.InputForm['type'] }>,
            res: Response,
            next: NextFunction
      ) {
            const { user } = req
            const { form, inputItem, type } = req.body
            const core = generateInputSettingWithType(type, form, inputItem)

            const { form: formUpdate } = await updateFormCommonSub({
                  form_id: form._id,
                  user_id: user?._id as Types.ObjectId,
                  sub_query: {
                        form_inputs: { $elemMatch: { _id: inputItem._id } }
                  },
                  update_query: {
                        $set: {
                              'form_inputs.$.core': core,
                              'form_inputs.$.type': type
                        }
                  }
            })

            return { form: formUpdate }
      }
}

export default FormInputService
