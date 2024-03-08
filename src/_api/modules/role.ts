/* eslint-disable @typescript-eslint/no-explicit-any */
import { $http } from '../http'

import { ResponseType, AxiosRequestConfig } from '../responseType'

interface Dto_UpdateAuthDto {
  menuAuth: string[]
  btnAuth: string[]
}
interface Dto_UpdateRoleDto {}
interface Dto_Role {
  id: number
  name: string
  createTime: string
  desc: string
  menuAuth: string[]
  btnAuth: string[]
}
interface Dto_CreateRoleDto {
  name: string
  desc: string
}
export type Body_postRole = Dto_CreateRoleDto
export type Res_getRole = Dto_Role
export type Res_getRoleById = Dto_Role
export type Body_putRoleById = Dto_UpdateRoleDto
export type Body_putRoleByIdAuth = Dto_UpdateAuthDto

class Role {
  /** 新增角色 */
  postRole(
    data: Body_postRole,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.request({
      url: '/api/role',
      method: 'post',
      ...{ data, ...axiosConfig }
    })
  }

  /** 查询所有角色 */
  getRole(
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<Res_getRole[]>> {
    return $http.request({
      url: '/api/role',
      method: 'get',
      ...{ ...axiosConfig }
    })
  }

  /** 查询单个角色信息 */
  getRoleById(
    id: number,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<Res_getRoleById>> {
    return $http.request({
      url: `/api/role/${id}`,
      method: 'get',
      ...{ ...axiosConfig }
    })
  }

  /** 修改角色 */
  putRoleById(
    id: string,
    data: Body_putRoleById,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.request({
      url: `/api/role/${id}`,
      method: 'put',
      ...{ data, ...axiosConfig }
    })
  }

  /** 删除角色 */
  deleteRoleById(
    id: string,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.request({
      url: `/api/role/${id}`,
      method: 'delete',
      ...{ ...axiosConfig }
    })
  }

  /** 编辑角色权限 */
  putRoleByIdAuth(
    id: number,
    data: Body_putRoleByIdAuth,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.request({
      url: `/api/role/${id}/auth`,
      method: 'put',
      ...{ data, ...axiosConfig }
    })
  }

  /** 绑定用户到当前角色 */
  postRoleByIdBindUser(
    id: number,
    data: number[],
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.request({
      url: `/api/role/${id}/bindUser`,
      method: 'post',
      ...{ data, ...axiosConfig }
    })
  }

  /** 查询当前角色所绑定的用户 */
  getRoleByIdUsers(
    id: number,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.request({
      url: `/api/role/${id}/users`,
      method: 'get',
      ...{ ...axiosConfig }
    })
  }
}

export const roleApi = new Role()
