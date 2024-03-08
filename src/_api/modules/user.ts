/* eslint-disable @typescript-eslint/no-explicit-any */
import { $http } from '../http'

import { ResponseType, AxiosRequestConfig } from '../responseType'

interface Dto_DepartmentTreeDto {
  id: number
  name: string
  children?: Dto_DepartmentTreeDto
}
interface Dto_Role {
  id: number
  name: string
  createTime: string
  desc: string
  menuAuth: string[]
  btnAuth: string[]
}
interface Dto_User {
  id: number
  username: string
  roles: Dto_Role[]
  department_id: number
}
interface Dto_CreateUserDto {
  username: string
  password: string
}
export type Body_postUser = Dto_CreateUserDto
export type Res_getUser = Dto_User
export type Res_getUserDepartmentTree = Dto_DepartmentTreeDto

class User {
  /** 登录获取token */
  postUser(
    data: Body_postUser,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<string>> {
    return $http.request({
      url: '/api/user',
      method: 'post',
      ...{ data, ...axiosConfig }
    })
  }

  /** 查询用户信息 */
  getUser(
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<Res_getUser>> {
    return $http.request({
      url: '/api/user',
      method: 'get',
      ...{ ...axiosConfig }
    })
  }

  /** 查询部门树 */
  getUserDepartmentTree(
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<Res_getUserDepartmentTree[]>> {
    return $http.request({
      url: '/api/user/departmentTree',
      method: 'get',
      ...{ ...axiosConfig }
    })
  }
}

export const userApi = new User()
