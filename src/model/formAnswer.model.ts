import { Document, Schema, Types, model } from 'mongoose'
import { Form } from '~/type'

const DOCUMENT_NAME = 'FormAnswerCore'
const COLLECTION_NAME = 'formAnswersCore'

const inputData = new Schema<Form.FormAnswer.InputFormData>({
      _id: { type: String, required: true },
      mode: { type: String, enum: ['Require', 'Optional'] },
      title: { type: String },
      type: { type: String, enum: ['TEXT', 'FILE_IMAGE', 'EMAIL', 'OPTION_MULTIPLE', 'OPTION', 'VOTE', 'DATE', 'PHONE', 'ADDRESS', 'ANCHOR'] },
      value: { type: Schema.Types.Mixed },
      description: { type: Schema.Types.Mixed }
})

const formAnswer = new Schema<Form.FormAnswer.TFormAnswer>(
      {
            form_id: { type: Schema.Types.ObjectId, ref: 'Form', required: true },
            answers: { type: [inputData], default: [] },
            create_time: { type: Date, default: Date.now },
            form_answer_state: { type: String, enum: ['Done', 'Temp'], default: 'Temp' },
            expireAt: {
                  type: Date,
                  default: Date.now,
                  index: {
                        expireAfterSeconds: 600,
                        partialFilterExpression: { form_answer_state: 'Temp' }
                  }
            }
      },
      { collection: 'formAnswerItem', timestamps: true }
)
export const oneAnswer = model('OneAnswer', formAnswer)

const formAnswerOrigin = new Schema<Form.FormAnswer.FormAnswerOrigin>(
      {
            form_id: { type: Schema.Types.ObjectId, ref: 'Form', required: true },
            owner_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            reports: [formAnswer]
      },
      { collection: COLLECTION_NAME, timestamps: true }
)

const formAnswerCore = model(DOCUMENT_NAME, formAnswerOrigin)

export default formAnswerCore
