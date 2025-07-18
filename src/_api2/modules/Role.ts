/* eslint-disable @typescript-eslint/no-explicit-any */
import { $http } from '../http'

import { ResponseType, AxiosRequestConfig } from '../responseType'

interface Dto_BindPermissionDto {
  roleId: number
  permissions: string[]
}
interface Dto_BindUserDto {
  roleId: number
  userIds: number[]
}
interface Dto_DeleteRoleDto {
  ids: number[]
}
interface Dto_CreateRoleDto {
  name: string
  desc: string
}
export type Body_postRole = Dto_CreateRoleDto
export type Body_deleteRole = Dto_DeleteRoleDto
export interface Res_deleteRole {}
interface Query_getRole {
  name: string
  desc: string
}
export type Body_putRoleById = Dto_CreateRoleDto
export interface Res_getRoleById {}
export type Body_postRoleUsers = Dto_BindUserDto
export type Body_postRolePermissions = Dto_BindPermissionDto

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

  /** 删除角色 */
  deleteRole(
    data: Body_deleteRole,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<Res_deleteRole>> {
    return $http.request({
      url: '/api/role',
      method: 'delete',
      ...{ data, ...axiosConfig }
    })
  }

  /** 查询角色列表(不分页) */
  getRole(
    params: Query_getRole,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.request({
      url: '/api/role',
      method: 'get',
      ...{ params, ...axiosConfig }
    })
  }

  /** 修改角色 */
  putRoleById(
    id: number,
    data: Body_putRoleById,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.request({
      url: `/api/role/${id}`,
      method: 'put',
      ...{ data, ...axiosConfig }
    })
  }

  /** 查询单个角色 */
  getRoleById(
    id: number,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.request({
      url: `/api/role/${id}`,
      method: 'get',
      ...{ ...axiosConfig }
    })
  }

  /** 绑定用户 */
  postRoleUsers(
    data: Body_postRoleUsers,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.request({
      url: '/api/role/users',
      method: 'post',
      ...{ data, ...axiosConfig }
    })
  }

  /** 绑定菜单权限 */
  postRolePermissions(
    data: Body_postRolePermissions,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.request({
      url: '/api/role/permissions',
      method: 'post',
      ...{ data, ...axiosConfig }
    })
  }
}

export const roleApi = new Role()
