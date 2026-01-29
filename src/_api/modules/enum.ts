/* eslint-disable @typescript-eslint/no-explicit-any */
import { $http } from '../http'

import { ResponseType, AxiosRequestConfig } from '../responseType'

interface Dto_UpdateEnumItemDto {
  value?: string
  label?: string
  isAuthColumn?: boolean
  enLabel?: string
  desc?: string
  enable?: boolean
}
interface Dto_CreateEnumItemsDto {
  value: string
  label: string
  isAuthColumn?: boolean
  enLabel?: string
  desc?: string
  enable?: boolean
}
interface Dto_UpdateEnumDto {
  type?: string
  code?: string
  name?: string
  desc?: string
  enable?: boolean
}
interface Dto_PaginationDto {
  currentPage: number
  pageSize: number
}
interface Dto_CreateEnumDto {
  type: string
  code: string
  name: string
  desc?: string
  enable?: boolean
}
export type Body_postEnum = Dto_CreateEnumDto
export type Body_getEnum = Dto_PaginationDto
interface Query_getEnumItems {
  code: string
}
export type Body_putEnumById = Dto_UpdateEnumDto
export type Body_postEnumItemsById = Dto_CreateEnumItemsDto
export type Body_putEnumItemsById = Dto_UpdateEnumItemDto

class Enum {
  /** 新增枚举 */
  postEnum(
    data: Body_postEnum,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.request({
      url: '/api/enum',
      method: 'post',
      ...{ data, ...axiosConfig }
    })
  }

  /** 分页查询枚举 */
  getEnum(
    data: Body_getEnum,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.request({
      url: '/api/enum',
      method: 'get',
      ...{ data, ...axiosConfig }
    })
  }

  /** 查询枚举类型 */
  getEnumType(
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.request({
      url: '/api/enum/type',
      method: 'get',
      ...{ ...axiosConfig }
    })
  }

  /** 查询单个枚举的枚举项 */
  getEnumItems(
    params: Query_getEnumItems,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.request({
      url: '/api/enum/items',
      method: 'get',
      ...{ params, ...axiosConfig }
    })
  }

  /** 修改枚举 */
  putEnumById(
    id: number,
    data: Body_putEnumById,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.request({
      url: `/api/enum/${id}`,
      method: 'put',
      ...{ data, ...axiosConfig }
    })
  }

  /** 新增枚举项 */
  postEnumItemsById(
    id: number,
    data: Body_postEnumItemsById[],
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.request({
      url: `/api/enum/items/${id}`,
      method: 'post',
      ...{ data, ...axiosConfig }
    })
  }

  /** 修改枚举项 */
  putEnumItemsById(
    id: number,
    data: Body_putEnumItemsById,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.request({
      url: `/api/enum/items/${id}`,
      method: 'put',
      ...{ data, ...axiosConfig }
    })
  }
}

export const enumApi = new Enum()
