/* eslint-disable @typescript-eslint/no-explicit-any */
import { $http } from '../http'

import { ResponseType, AxiosRequestConfig } from '../responseType'

export interface Res_schemasRole {
  id: number
  role: string
  createTime: string
  desc: string
  menuAuth: any[]
  btnAuth: string
}
export interface Body_schemasArrTypeItem {
  name: string
  age: number
}
export interface Res_schemasRole {
  id: number
  role: string
  createTime: string
  desc: string
  menuAuth: any[]
  btnAuth: string
}
export interface Body_schemasUpdateRoleDto {}

class Role {
  /** 查询所有角色 */
  getRole(
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<Res_schemasRole[]>> {
    return $http.request({
      url: '/api/role',
      method: 'get',
      ...{ ...axiosConfig }
    })
  }

  /** 新增角色 */
  postRole(
    data: Body_schemasArrTypeItem[],
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.request({
      url: '/api/role',
      method: 'post',
      ...{ data, ...axiosConfig }
    })
  }

  /** 查询单个角色信息 */
  getRoleById(
    id: string,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<Res_schemasRole>> {
    return $http.request({
      url: `/api/role/${id}`,
      method: 'get',
      ...{ ...axiosConfig }
    })
  }

  /** 修改角色 */
  putRoleById(
    id: string,
    data: Body_schemasUpdateRoleDto,
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

  /** 编辑角色菜单权限 */
  putRoleMenuById(
    id: string,
    data: any[],
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.request({
      url: `/api/role/menu/${id}`,
      method: 'put',
      ...{ data, ...axiosConfig }
    })
  }
}

export const roleApi = new Role()
