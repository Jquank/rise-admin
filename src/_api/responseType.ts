/* eslint-disable @typescript-eslint/no-explicit-any */
/** you can modify this type according to your needs, the generic type T is the response data type */
export type { AxiosRequestConfig } from 'axios'
export interface ResponseType<T = any> {
  code: number
  message: string
  data: T
  status?: number
  success?: boolean
  path?: string
  time?: number | string
}
