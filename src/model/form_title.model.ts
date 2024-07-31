import { Schema, Types, model } from 'mongoose'
import { Form } from '~/type'

export const formTitleSubSchema = new Schema<Form.FormTitle.FormTitleBase>({
      type: { type: String, enum: ['Text', 'FullDescription', 'Image'], default: 'Text' },
      form_id: { type: Schema.Types.ObjectId, ref: 'Form', require: true },
      core: { type: Schema.Types.Mixed }
})

export const generateCoreTextObject = ({ value }: { value: Form.FormTitle.Text.Core['core']['value'] }) => {
      return {
            value
      }
}

export const generateCoreImageObject = ({ url }: { url: Form.FormTitle.Image.Core['core']['url'] }) => {
      return {
            url
      }
}

export const generateCoreFullDescriptionObject = ({
      header_value,
      value
}: {
      header_value: Form.FormTitle.FullDescription.Core['core']['header_value']
      value: Form.FormTitle.FullDescription.Core['core']['value']
}) => {
      return {
            header_value,
            value
      }
}

export const generateSubTitleType = ({ type, form_id }: { type: Form.FormTitle.FormTitleBase['type']; form_id: Types.ObjectId }) => {
      switch (type) {
            case 'Text':
                  const text = {
                        type,
                        form_id
                  }
                  return text

            case 'Image':
                  const image = {
                        type,
                        form_id
                  }
                  return image

            case 'FullDescription':
                  const fullDescription = {
                        type,
                        form_id
                  }

                  return fullDescription
      }
}

export const formTitleSubModel = model('FormTitleSub', formTitleSubSchema)
