/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ResponseType } from '@/api/responseType'
import { $http } from '@/api/http'
import type { AxiosRequestConfig } from 'axios'

export type Res_getList = any

class List {
  getList(
    params: Record<string, any>,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<Res_getList[]>> {
    return $http.request({
      url: '/mock/list',
      method: 'get',
      ...{ params, ...axiosConfig }
    })
  }
}

export const listApi = new List()
