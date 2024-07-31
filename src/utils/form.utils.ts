import { Document } from 'mongoose'
import { Types, UpdateQuery } from 'mongoose'
import { BadRequestError, InternalError } from '~/Core/response.error'
import formModel, { FormSchema, FormSchemaDoc } from '~/model/form.model'
import { UserDocument } from '~/model/user.model'

export const foundForm = async ({ form_id, user_id }: { form_id: Types.ObjectId; user_id: Types.ObjectId }) => {
      const form = await formModel.findOne({ _id: form_id, form_owner: user_id })
      if (!form) throw new BadRequestError({ metadata: 'form_id không hợp lệ' })

      return form
}

export const generateUpdateForm = async <T>({
      update,
      form_id,
      form_owner
}: {
      update: UpdateQuery<T>
      form_id: Types.ObjectId
      form_owner: Types.ObjectId
}) => {
      const formQuery = { _id: form_id, form_owner }
      const formOptions = { new: true, upsert: true }
      const newForm = await formModel.findOneAndUpdate(formQuery, update, formOptions)
      if (!newForm) throw new InternalError({ metadata: 'Không thể update form' })
      return newForm
}

export const renderCountFormState = async ({ user }: { user: UserDocument }) => {
      let formDelete = 0
      let formPublic = 0
      let formPrivate = 0
      const formQuery = { form_owner: user?._id }
      const forms = await formModel.find(formQuery)

      forms.forEach((form) => {
            if (form.form_state === 'isDelete') {
                  formDelete += 1
            }

            if (form.form_state === 'isPrivate') {
                  formPrivate += 1
            }

            if (form.form_state === 'isPublic') {
                  formPublic += 1
            }
      })

      return { formDelete, formPublic, formPrivate }
}

export const updateFormCommon = async ({ form_id, user_id, update_query }: { form_id: Types.ObjectId; user_id: Types.ObjectId; update_query: Object }) => {
      const formQuery = { _id: form_id, form_owner: user_id }
      const formUpdate = update_query
      const formOptions = { new: true, upsert: true }

      const formAfterUpdate = await formModel.findOneAndUpdate(formQuery, formUpdate, formOptions)

      return { form: formAfterUpdate }
}

export const updateFormCommonSub = async ({
      form_id,
      user_id,
      sub_query,
      update_query
}: {
      form_id: Types.ObjectId
      user_id: Types.ObjectId
      sub_query: Object
      update_query: Object
}) => {
      const formQuery = { _id: form_id, form_owner: user_id, ...sub_query }
      const formUpdate = update_query
      const formOptions = { new: true, upsert: true }

      const formAfterUpdate = await formModel.findOneAndUpdate(formQuery, formUpdate, formOptions)

      return { form: formAfterUpdate }
}
