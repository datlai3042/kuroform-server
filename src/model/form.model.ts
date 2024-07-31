import mongoose, { Document, Schema, Types, model } from 'mongoose'
import { Form, InputCore } from '~/type'
import { inputCoreSchema } from './input.model'
import { formTitleSubSchema } from './form_title.model'

const DOCUMENT_NAME = 'Form'
const COLLECTION_NAME = 'forms'

type FormInputs = InputCore.InputForm[]
export type FormBackgroundMode = 'DEFAULT' | 'CUSTOM'

export type FormState = 'isPrivate' | 'isPublic' | 'isDelete'
type FormTextStyle = 'normal' | 'italic'
type FormAvatarPosition = 'left' | 'center' | 'right'
type FormAvatarMode = 'circle' | 'square'
export type FormModeDisplay = 'basic' | 'custom'

export type FormSchema = {
      form_owner: Types.ObjectId
      form_color?: string,
      form_button_text: string,
      form_background?: {
            backgroundColor?: string
            form_background_iamge_url: string
            form_backround_image_publicId: string
            mode_show: 'cover' | 'contain'
            position: {
                  top: number
                  left: number
            }
            object: {
                  x: number
                  y: number
            }
            size: {
                  width: number
                  height: number
            }
            padding: {
                  x: number

                  y: number
            }
      }

      form_title?: {
            form_title_style?: FormTextStyle
            form_title_value: string
            form_title_color?: string
            form_title_size?: number
            form_title_mode_image: 'Normal' | 'Slider'
            form_title_sub: Form.FormTitle.FormTitleBase[]
      }

      form_avatar_state: boolean
      form_background_state: boolean
      form_avatar?: {
            form_avatar_url: string
            form_avatar_publicId: string
            position: FormAvatarPosition
            mode_shape: FormAvatarMode
      }

      form_mode_display: FormModeDisplay
      form_response: number

      form_setting_default: {
            form_background_default_url: string

            form_avatar_default_postion: FormAvatarPosition
            form_avatar_default_url: string
            form_avatar_default_mode: FormAvatarMode
            form_title_color_default?: string
            form_title_size_default: number
            form_title_style_default: string
            input_color: string
            input_size: number
            input_style: string
      }
      form_state: FormState
      form_views: number

      form_inputs: mongoose.Types.DocumentArray<InputCore.InputCommon[]>
      expireAt?: Date
}

export type FormSchemaDoc = FormSchema & Document

export const formSchema = new Schema<FormSchemaDoc>(
      {
            form_owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            form_views: { type: Number, default: 0 },
            form_response: { type: Number, default: 0 },
            form_button_text: {type: String, default: 'Gửi'},
            form_color: {type: String, default: ''},
            form_avatar: {
                  type: {
                        form_avatar_url: String,
                        form_avatar_publicId: String,
                        position: { type: String, enum: ['left', 'center', 'right'], default: 'center' },
                        mode_shape: { type: String, enum: ['circle', 'square'], default: 'circle' }
                  }
            },
            form_title: {
                  type: {
                        form_title_color: { type: String },
                        form_title_size: { type: Number, max: 30 },
                        form_title_style: { type: String },
                        form_title_value: { type: String },
                        form_title_sub: { type: [formTitleSubSchema] },
                        form_title_mode_image: { type: String }
                  },
                  default: {
                        form_title_color: 'rgb(127, 139, 199)',
                        form_title_size: 30,
                        form_title_style: 'normal',
                        form_title_value: '',
                        form_title_mode_image: 'Normal',
                        form_title_sub: []
                  }
            },
            form_background: {
                  type: {
                        backgroundColor: String,
                        form_background_iamge_url: String,
                        form_backround_image_publicId: String,
                        mode_show: { type: String, enum: ['cover', 'contain'], default: 'cover' },
                        position: {
                              top: Number,
                              left: Number
                        },
                        size: {
                              width: Number,
                              height: Number
                        },
                        object: {
                              x: { type: Number, default: 50 },
                              y: { type: Number, default: 50 }
                        },
                        padding: {
                              x: { type: Number, default: 0 },

                              y: { type: Number, default: 0 }
                        }
                  }
            },
            form_avatar_state: { type: Boolean, default: false },
            form_background_state: { type: Boolean, default: false },
            form_state: { type: String, enum: ['isPublic', 'isPrivate', 'isDelete'], default: 'isPrivate' },
            form_mode_display: { type: String, enum: ['basic', 'custom'], default: 'basic' },

            form_setting_default: {
                  type: {
                        form_avatar_default_postion: String,
                        form_background_default_url: String,
                        form_avatar_default_url: String,
                        form_title_color_default: String,
                        form_title_size_default: Number,
                        form_title_style_default: String,
                        form_avatar_default_mode: String,

                        input_color: String,
                        input_size: { type: Number, max: 24 },
                        input_style: String
                  },
                  default: {
                        form_avatar_default_postion: 'center',

                        form_avatar_default_mode: 'circle',
                        input_color: '#000000',
                        input_size: 24,
                        input_style: 'normal',
                        form_title_color_default: '#2568aa',
                        form_title_size_default: 30,
                        form_title_style_default: 'normal',
                        form_background_default_url:
                              'https://res.cloudinary.com/cloud304/image/upload/v1721751613/kuroform/systems/form/background_form_default.jpg',
                        form_avatar_default_url: 'https://res.cloudinary.com/cloud304/image/upload/v1721751902/kuroform/systems/form/avatar_default.jpg'
                  }
            },
            form_inputs: [inputCoreSchema],

      },
      { collection: COLLECTION_NAME, timestamps: true }
)

formSchema.index({ 'form_title.form_title_value': 'text' })
const formModel = model<FormSchemaDoc>(DOCUMENT_NAME, formSchema)

export default formModel
