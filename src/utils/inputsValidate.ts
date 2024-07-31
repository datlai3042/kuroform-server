import { BadRequestError, NotFoundError } from '~/Core/response.error'
import { InputCore } from '~/type'

export class InputHelper {
      static typeNumber(input: InputCore.InputForm, errors: string[] = []) {}
      static typeEmail(input: InputCore.InputEmail.InputTypeEmail, errors: string[] = []) {
            if (InputValidate.typeEmail(input)) return input
            // return errors.push(input.setting?.input_error as string)
      }
      static typeDate(input: InputCore.InputDate.InputTypeDate, errors: string[]) {
            // if (InputValidate.typeDate(input)) return input
            // return errors.push(input.)
      }
}

export class InputValidate {
      static typeNumber(input: InputCore.InputForm, errors: string[] = []) {
            // if()
            // return true ? true : errors.push('')
      }
      static typeEmail(input: InputCore.InputEmail.InputTypeEmail, errors: string[] = []) {
            const regex = /[^\s@]+@[^\s@]+\.[^\s@]+/gi
            return input?.input_value?.match(regex)
      }
      // static typeDate(input: InputCore.InputDate.InputTypeDate) {
      //       if (input.date_type === 'Any') {
      //             return input
      //       }
      //       if (input.date_type === 'After') {
      //             return false
      //       }
      // }
}

export const validateEmail = (email: string) => {
      const regex = /[^\s@]+@[^\s@]+\.[^\s@]+/gi
      return email.match(regex)
}

const validateInputChecker = (input_data: InputCore.InputForm[], input_condition_validate: InputCore.InputForm[]) => {
      const errors: string[] = []
      // const check = input_data.every((input) => {
      //       if (input.type === 'Option') return
      //       switch (input.type) {
      //             case 'EMAIL':
      //                   return InputHelper.typeEmail(input, errors)

      //             // case 'Number':
      //             //       return InputHelper.typeNumber(input, errors)

      //             default:
      //                   return new NotFoundError({ metadata: 'Định dạng input không được hỗ trợ' })
      //       }
      // })

      // return check ? input_data : new BadRequestError({ metadata: errors })
}

export default validateInputChecker
