import { CookieOptions, Response } from 'express'

export const omit = <T extends object, K extends keyof T>(object: T, fields: K[]): Record<K, T[K]> => {
      const newObj = { ...object }

      for (let index = 0; index < fields.length; index++) {
            if (fields[index] in object) {
                  delete newObj[fields[index]]
            }
      }

      return newObj
}

export const oneWeek = 7 * 24 * 60 * 60 * 1000 // 7 ngày tính bằng miligiây
export const expriresAT = 60 * 30 * 1000 // 7 ngày tính bằng miligiây

export const setCookieResponse = (res: Response, expires: string, name: string, value: string, options?: CookieOptions) => {
      const expiryDate = new Date(expires)
      res.cookie(name, value, { ...options, expires: expiryDate, sameSite: 'none', path: '/', secure: true })
      return expiryDate
}
