import {
      generateInputSettingDefault,
      inputSettingEmail,
      inputSettingOption,
      inputSettingPhone,
      inputSettingText,
      inputSettingVote,
      inputSettingDate,
      inputSettingImage,
      inputSettingAddress,
      inputSettingAnchor
} from '~/constants/input.constants'
import { Core, Form, InputCore } from '~/type'

export const generateInputSettingWithType = (type: InputCore.InputForm['type'], form: Form.FormCore, inputItem: InputCore.InputForm) => {
      let core = {} as Core.CoreCommon
      switch (type) {
            case 'TEXT': {
                  const setting_default = generateInputSettingDefault(form, inputItem)
                  return (core = { setting: { ...inputSettingText, ...inputItem.core.setting, ...setting_default } } as Core.Text)
            }

            case 'EMAIL': {
                  const setting_default = generateInputSettingDefault(form, inputItem)
                  return (core = { setting: { ...inputSettingEmail, ...inputItem.core.setting, ...setting_default } } as Core.Text)
            }

            case 'VOTE': {
                  const setting_default = generateInputSettingDefault(form, inputItem)
                  return (core = { setting: { ...inputSettingVote, ...inputItem.core.setting, ...setting_default } } as Core.Text)
            }

            case 'PHONE': {
                  const setting_default = generateInputSettingDefault(form, inputItem)
                  return (core = { setting: { ...inputSettingPhone, ...inputItem.core.setting, ...setting_default } } as Core.Text)
            }



            case 'ADDRESS': {
                  const setting_default = generateInputSettingDefault(form, inputItem)

                  return (core = { setting: { ...inputSettingAddress, ...inputItem.core.setting, ...setting_default } } as Core.Address)
            }

            case 'ANCHOR': {
                  const setting_default = generateInputSettingDefault(form, inputItem)

                  return (core = { setting: { ...inputSettingAnchor, ...inputItem.core.setting, ...setting_default } } as Core.Anchor)
            }

            case 'OPTION': {
                  const setting_default = generateInputSettingDefault(form, inputItem)
                  return (core = { setting: { ...inputSettingOption, ...inputItem.core.setting, ...setting_default }, options: [] } as Core.Option)
            }

            case 'OPTION_MULTIPLE': {
                  const setting_default = generateInputSettingDefault(form, inputItem)
                  return (core = { setting: { ...inputSettingOption, ...inputItem.core.setting, ...setting_default }, options: [] } as Core.Option)
            }

            case 'DATE': {
                  const setting_default = generateInputSettingDefault(form, inputItem)
                  return (core = { setting: { ...inputSettingDate, ...inputItem.core.setting, ...setting_default } } as Core.Option)
            }

            case 'FILE_IMAGE': {
                  const setting_default = generateInputSettingDefault(form, inputItem)
                  return (core = { setting: { ...inputSettingImage, ...inputItem.core.setting, ...setting_default } } as Core.Option)
            }
      }

      return core
}
