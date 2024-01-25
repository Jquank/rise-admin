/* eslint-disable @typescript-eslint/no-explicit-any */
export type { AxiosRequestConfig } from 'axios'
export interface ResponseType<T = any> {
  code: number
  status?: number
  message: string
  success?: boolean
  data: T
}
