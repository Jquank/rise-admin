/* eslint-disable @typescript-eslint/no-explicit-any */
import { $http } from '../http'

import { ResponseType, AxiosRequestConfig } from '../responseType'

interface Dto_CreateUserDto {
  username: string
  password: string
}
export type Body_postUserRegister = Dto_CreateUserDto
interface Query_getUserByRoleNames {
  roleNames: string
}
interface Query_getUserByRoleIds {
  roleIds: string
}

class User {
  /**  */
  postUserRegister(
    data: Body_postUserRegister,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.request({
      url: '/api/user/register',
      method: 'post',
      ...{ data, ...axiosConfig }
    })
  }

  /**  */
  getUser(axiosConfig: AxiosRequestConfig = {}): Promise<ResponseType<any>> {
    return $http.request({
      url: '/api/user',
      method: 'get',
      ...{ ...axiosConfig }
    })
  }

  /**  */
  getUserList(
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.request({
      url: '/api/user/list',
      method: 'get',
      ...{ ...axiosConfig }
    })
  }

  /**  */
  getUserByRoleNames(
    params: Query_getUserByRoleNames,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.request({
      url: '/api/user/byRoleNames',
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
      url: '/api/user/byRoleIds',
      method: 'get',
      ...{ params, ...axiosConfig }
    })
  }

  /**  */
  getUserById(
    id: number,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.request({
      url: `/api/user/${id}`,
      method: 'get',
      ...{ ...axiosConfig }
    })
  }
}

export const userApi = new User()
