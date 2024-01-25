/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ResponseType } from '@/api/responseType'
import { $http } from '@/api/http'

export type Res_getList = any

class List {
  getList(params: Record<string, any>): Promise<ResponseType<Res_getList[]>> {
    return $http.get('/mock/list', { params })
  }
}

export const listApi = new List()
