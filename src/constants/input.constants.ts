import { Form, InputCore } from '~/type'

const inputSettingCommon = {
      require: false,
      input_error: 'Nội dung không hợp lệ',
      input_error_state: false,
      input_color: '#000000',
      input_size: 16,
      input_style: 'normal'
}

export const inputSettingText = {
      maxLength: 100,
      placeholder: 'Nhập nội dung của bạn',
      minLength: 1,
      ...inputSettingCommon
}

export const inputSettingEmail = {
      maxLength: 100,
      placeholder: 'Nhập email của bạn',
      minLength: 5,
      ...inputSettingCommon
}

export const inputSettingOption = {
      ...inputSettingCommon
}

export const inputSettingVote = {
      ...inputSettingCommon
}

export const inputSettingPhone = {
      ...inputSettingCommon
}

export const inputSettingDate = {
      ...inputSettingCommon
}

export const inputSettingImage = {
      ...inputSettingCommon
}

export const inputSettingAddress = {
      ...inputSettingCommon
}

export const inputSettingAnchor = {
      ...inputSettingCommon
}

export const generateInputSettingDefault = (form: Form.FormCore, inputItem: InputCore.InputForm) => {
      const style = {
            input_color: form.form_setting_default.input_color || inputItem.core.setting.input_color,
            input_size: form.form_setting_default.input_size || inputItem.core.setting.input_size,
            input_style: form.form_setting_default.input_style || inputItem.core.setting.input_style
      }

      return style
}
