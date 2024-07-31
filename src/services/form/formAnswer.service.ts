import { NextFunction, Response } from 'express'
import { Types } from 'mongoose'
import { BadRequestError } from '~/Core/response.error'
import formModel from '~/model/form.model'
import formAnswerModel, { oneAnswer } from '~/model/formAnswer.model'
import { CustomRequest, Form, Notification } from '~/type'
import createANotification from '~/utils/notification'
import uploadToCloudinary from '~/utils/upload.cloudinary'

class FormAnswerService {
      static async addAnswerForm(
            req: CustomRequest<{ formAnswer: Form.FormAnswer.TFormAnswer & { form_owner: Types.ObjectId; form_answer_id: Types.ObjectId } }>,
            res: Response,
            next: NextFunction
      ) {
            const { formAnswer } = req.body
            const found_form_origin = await formModel.findOne({ _id: formAnswer.form_id })

            const oneAnswerUpdate = await oneAnswer.findOneAndUpdate(
                  { _id: formAnswer.form_answer_id },
                  { $set: { answers: formAnswer.answers, form_answer_state: 'Done' } },
                  { new: true, upsert: true }
            )

            const formAnswerQuery = { form_id: formAnswer.form_id, owner_id: formAnswer.form_owner }
            const formAnswerUpdate = { $push: { reports: oneAnswerUpdate } }
            const formAnswerOption = { new: true, upsert: true }

            const found_form_answer = await formAnswerModel.findOneAndUpdate(formAnswerQuery, formAnswerUpdate, formAnswerOption)

            const createNotification = await createANotification({
                  user_id: found_form_answer?.owner_id as Types.ObjectId,
                  type: 'Form_Answers',
                  core: {
                        message: `bạn đã nhận 1 phiếu trả lời`,
                        form_id: found_form_answer?.form_id as unknown as string,
                        form_answer_id: found_form_answer?.reports[found_form_answer.reports.length - 1]._id?.toString()
                  }
            })

            createNotification!.notifications!.notifications = createNotification!.notifications?.notifications.sort(
                  (a, b) => b.create_time.getTime() - a.create_time.getTime()
            ) as Notification.NotifcationCore[]

            if (found_form_origin) {
                  found_form_origin.form_response += 1
                  await found_form_origin.save()
            }

            if (global._userSocket.length > 0) {
                  const check_user = global._userSocket.find((user) => {
                        return user.client_id === found_form_answer?.owner_id.toString()
                  })

                  if (check_user) {
                        global._io.to(check_user.socket_id).emit('add-new-reports', {
                              type: 'Answer',
                              form_answer_id: found_form_answer?._id,
                              form_answer_item_id: found_form_answer?.reports[found_form_answer.reports.length - 1]._id?.toString(),

                              notification: createNotification.notifications,
                              notification_item_id: createNotification.notification_item_id,
                              form_origin: found_form_origin,
                              total_views: found_form_origin?.form_views
                        })
                  }

                  return { message: 'Đã gửi tới người tạo form' }
            }
            return { message: 'Gửi thành công' }
      }

      static async increaseViewFormAnswer(req: CustomRequest<{ form_id: Types.ObjectId }>, res: Response, next: NextFunction) {
            const { form_id } = req.body
            const formUpdateView = await formModel.findOne({ _id: form_id })
            if (!formUpdateView) throw new BadRequestError({ metadata: 'Không tìm thấy form gốc' })
            formUpdateView.form_views = (formUpdateView?.form_views || 0) + 1
            await formUpdateView.save()

            return { messsage: 'Cập nhập views thành công' }
      }

      static async getFormAnswer(req: CustomRequest<object, { form_id: string }>, res: Response, next: NextFunction) {
            const { form_id } = req.query
            const { user } = req
            const formAnswerQuery = { form_id: form_id, owner_id: user?._id, 'reports.form_answer_state': { $eq: 'Done' } }

            const found_form_answer = await formAnswerModel.findOne(formAnswerQuery)

            return { formAnswer: found_form_answer }
      }

      static async getTotalViewForm(req: CustomRequest, res: Response, next: NextFunction) {
            const { user } = req
            const formAnswerQuery = { form_owner: user?._id }
            const findFormOrigin = await formModel.find(formAnswerQuery)

            let totalView = 0
            findFormOrigin.forEach((form) => {
                  totalView += form.form_views
            })

            return { views: totalView }
      }

      static async getTotaLAnswerForm(req: CustomRequest, res: Response, next: NextFunction) {
            const { user } = req
            const formAnswerQuery = { owner_id: user?._id }
            const found_form_answer_user = await formAnswerModel.find(formAnswerQuery)

            let total_answer = 0
            found_form_answer_user!.forEach((form) => {
                  total_answer += form.reports.length
            })

            return { total: total_answer }
      }

      static async uploadFileFormAnswer(
            req: CustomRequest<{ form_answers_id: Types.ObjectId; form_id: Types.ObjectId; inputItem: Form.FormAnswer.InputFormData }>,
            res: Response,
            next: NextFunction
      ) {
            const { form_id, form_answers_id, inputItem } = req.body

            const file = req.file
            const found_form_origin = await formModel.findOne({ _id: form_id })
            if (!found_form_origin) throw new BadRequestError({ metadata: 'Không tìm thấy form' })

            const { form_owner, _id } = found_form_origin

            if (file) {
                  const folder = `${process.env.CLOUDINARY_FOLDER_PREFIX}/users/user_id_${form_owner}/form_id_${_id}/form_answers_id_${form_answers_id}/`
                  const result = await uploadToCloudinary(file, folder)
                  const input_update = { ...inputItem, value: result.secure_url }
                  const form_answers_res = await oneAnswer.findOneAndUpdate(
                        {
                              _id: form_answers_id,
                              form_id: form_id
                        },
                        {
                              $push: {
                                    answers: { input_update }
                              }
                        },
                        { new: true, upsert: true }
                  )
                  return { form_answers_res, url: result.secure_url }
            }
      }
}

export default FormAnswerService
