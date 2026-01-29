/* eslint-disable @typescript-eslint/no-explicit-any */
import { $http } from '../http'

import { ResponseType, AxiosRequestConfig } from '../responseType'

interface Dto_PaginationDto {
  currentPage: number
  pageSize: number
}
export type Body_postHouseTenants = Dto_PaginationDto

class House {
  /** 导入租户数据 */
  postHouseImportTenants(
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.request({
      url: '/api/house/import/tenants',
      method: 'post',
      ...{ ...axiosConfig }
    })
  }

  /**  */
  postHouseTenants(
    data: Body_postHouseTenants,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.request({
      url: '/api/house/tenants',
      method: 'post',
      ...{ data, ...axiosConfig }
    })
  }
}

export const houseApi = new House()
