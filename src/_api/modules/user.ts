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

  changePassword(data: {
    oldPassword: string
    newPassword: string
  }): Promise<ResponseType<any>> {
    return $http.post('/api/user/change-password', data)
  }

  // ========== 管理端 ==========

  getPaginatedUsers(params?: {
    page?: number
    pageSize?: number
    keyword?: string
  }): Promise<
    ResponseType<{
      records: Res_UserManage[]
      total: number
      page: number
      pageSize: number
    }>
  > {
    return $http.get('/api/user/manage/paginated', { params })
  }

  createUser(
    data: Body_AdminCreateUser
  ): Promise<ResponseType<Res_UserManage & { initialPassword?: string }>> {
    return $http.post('/api/user/manage', data)
  }

  updateUser(
    id: number,
    data: Body_AdminUpdateUser
  ): Promise<ResponseType<Res_UserManage>> {
    return $http.put(`/api/user/manage/${id}`, data)
  }

  resetPassword(id: number): Promise<ResponseType<{ newPassword: string }>> {
    return $http.post(`/api/user/manage/${id}/reset-password`)
  }

  deleteUser(id: number): Promise<ResponseType<any>> {
    return $http.delete(`/api/user/manage/${id}`)
  }
}

// ========== 管理端类型 ==========

export type Res_UserManage = {
  id: number
  username: string
  name: string | null
  email: string | null
  isActive: boolean
  isVerified: boolean
  createdAt: string
  lastLoginAt: string | null
  roles: { id: number; name: string }[]
}

export interface Body_AdminCreateUser {
  username: string
  password?: string
  name?: string
  roleIds?: number[]
}

export interface Body_AdminUpdateUser {
  name?: string
  email?: string
  password?: string
  isActive?: boolean
  roleIds?: number[]
}

export const userApi = new User()
