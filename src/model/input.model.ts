import mongoose, { Document, Schema, model } from 'mongoose'
import { Core, InputCore } from '~/type'

export const inputCoreSchema = new Schema<InputCore.InputCommon & { type: InputCore.InputForm['type']; core: Core.Option | Core.Text }>(
      {
            type: {
                  type: String,
                  enum: ['TEXT', 'FILE_IMAGE', 'EMAIL', 'OPTION_MULTIPLE', 'OPTION', 'VOTE', 'PHONE', 'DATE', 'ADDRESS', 'ANCHOR'],
                  default: 'EMAIL'
            },
            input_title: { type: String },
            core: { type: Schema.Types.Mixed, require: true }
      },
      { collection: 'InputCore' }
)

export const inputModel = model('InputCore', inputCoreSchema)

export const coreInputText = new Schema({
      inputCore: { type: Schema.Types.ObjectId, ref: 'InputCore' },
      setting: {
            input_error: { type: String, default: 'Email không hợp lệ', required: true },
            placeholder: { type: String, default: 'Nhập Email của bạn', required: true },
            require: { type: Boolean, default: false },
            minLength: { type: Number, default: 8 },
            maxLength: { type: Number, default: 100 },
            input_color: { type: String, default: '#000000' },
            input_style: { type: String, enum: ['normal', 'italic'], default: '#000000' },
            input_size: { type: Number, default: 16 }
      }
})

export const coreInputTextModel = model('InputTextCore', coreInputText)

export const coreInputEmail = new Schema({
      inputCore: { type: Schema.Types.ObjectId, ref: 'InputCore' },
      setting: {
            input_error: { type: String, default: 'Email không hợp lệ', required: true },
            placeholder: { type: String, default: 'Nhập Email của bạn', required: true },
            require: { type: Boolean, default: false },
            minLength: { type: Number, default: 8 },
            maxLength: { type: Number, default: 100 },
            input_color: { type: String, default: '#000000' },
            input_style: { type: String, enum: ['normal', 'italic'], default: '#000000' },
            input_size: { type: Number, default: 16 }
      }
})
export const coreInputEmailModel = model('InputEmailCore', coreInputEmail)

export const coreInputOption = new Schema({
      inputCore: { type: Schema.Types.ObjectId, ref: 'InputCore' },
      setting: {
            input_error: { type: String, default: 'Email không hợp lệ', required: true },
            placeholder: { type: String, default: 'Nhập Email của bạn', required: true },
            require: { type: Boolean, default: false },
            minLength: { type: Number, default: 8 },
            maxLength: { type: Number, default: 100 },
            input_color: { type: String, default: '#000000' },
            input_style: { type: String, enum: ['normal', 'italic'], default: '#000000' },
            input_size: { type: Number, default: 16 }
      }
})

export const coreInputOptionModel = model('InputOptionCore', coreInputOption)
