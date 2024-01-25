/* eslint-disable @typescript-eslint/no-explicit-any */
import { $http } from '../http'

import { ResponseType, AxiosRequestConfig } from '../responseType'

export interface Body_schemasCreateUserDto {
  username: string
  password: string
}

class User {
  /** 登录获取token */
  postUser(
    data: Body_schemasCreateUserDto,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<string>> {
    return $http.request({
      url: '/api/user',
      method: 'post',
      ...{ data, ...axiosConfig }
    })
  }

  /** 获取用户信息 */
  getUser(axiosConfig: AxiosRequestConfig = {}): Promise<ResponseType<any>> {
    return $http.request({
      url: '/api/user',
      method: 'get',
      ...{ ...axiosConfig }
    })
  }
}

export const userApi = new User()
