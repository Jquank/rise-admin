/* eslint-disable @typescript-eslint/no-explicit-any */
import { $http } from '../http'

import { ResponseType, AxiosRequestConfig } from '../responseType'

interface Dto_CreateUserDto {
  username: string
  password: string
}
export type Body_postAuthLogin = Dto_CreateUserDto

class Auth {
  /**  */
  postAuthLogin(
    data: Body_postAuthLogin,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.request({
      url: '/api/auth/login',
      method: 'post',
      ...{ data, ...axiosConfig }
    })
  }
}

export const authApi = new Auth()
