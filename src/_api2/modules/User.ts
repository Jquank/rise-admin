/* eslint-disable @typescript-eslint/no-explicit-any */
import { $http } from '../http'

import { ResponseType, AxiosRequestConfig } from '../responseType'

interface Dto_CreateUserDto {
  email: string
  name: string
  age: number
}
export type Body_postUser = Dto_CreateUserDto
interface Query_getUserByRoleNames {
  roleNames: string
}
interface Query_getUserByRoleIds {
  roleIds: string
}
export interface Res_getUserById {}

class User {
  /**  */
  postUser(
    data: Body_postUser,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.request({
      url: '/user',
      method: 'post',
      ...{ data, ...axiosConfig }
    })
  }

  /**  */
  getUser(axiosConfig: AxiosRequestConfig = {}): Promise<ResponseType<any>> {
    return $http.request({ url: '/user', method: 'get', ...{ ...axiosConfig } })
  }

  /**  */
  getUserByRoleNames(
    params: Query_getUserByRoleNames,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.request({
      url: '/user/byRoleNames',
      method: 'get',
      ...{ params, ...axiosConfig }
    })
  }

  /**  */
  getUserByRoleIds(
    params: Query_getUserByRoleIds,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.request({
      url: '/user/byRoleIds',
      method: 'get',
      ...{ params, ...axiosConfig }
    })
  }

  /**  */
  getUserById(
    id: number,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<Res_getUserById>> {
    return $http.request({
      url: `/user/${id}`,
      method: 'get',
      ...{ ...axiosConfig }
    })
  }
}

export const UserApi = new User()
