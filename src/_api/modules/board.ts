/* eslint-disable @typescript-eslint/no-explicit-any */
import { $http } from '../http'

import { ResponseType, AxiosRequestConfig } from '../responseType'

interface Dto_CardDto_data {}
interface Dto_CardDto_config {}
interface Dto_CardDto {
  id?: number
  title: string
  value: string
  type: string
  x: number
  y: number
  w: number
  h: number
  i: string
  config: Dto_CardDto_config
  data: Dto_CardDto_data
}
interface Dto_UpdateBoardDto {
  id: number
  cards?: Dto_CardDto[]
  title: string
  desc?: string
}
interface Dto_CreateBoardDto {
  title: string
  desc?: string
}
export type Body_postBoard = Dto_CreateBoardDto
export type Body_putBoard = Dto_UpdateBoardDto

class Board {
  /**  */
  postBoard(
    data: Body_postBoard,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.request({
      url: '/api/board',
      method: 'post',
      ...{ data, ...axiosConfig }
    })
  }

  /**  */
  putBoard(
    data: Body_putBoard,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.request({
      url: '/api/board',
      method: 'put',
      ...{ data, ...axiosConfig }
    })
  }

  /**  */
  getBoard(axiosConfig: AxiosRequestConfig = {}): Promise<ResponseType<any>> {
    return $http.request({
      url: '/api/board',
      method: 'get',
      ...{ ...axiosConfig }
    })
  }

  /**  */
  deleteBoardById(
    id: number,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.request({
      url: `/api/board/${id}`,
      method: 'delete',
      ...{ ...axiosConfig }
    })
  }

  /**  */
  getBoardById(
    id: number,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.request({
      url: `/api/board/${id}`,
      method: 'get',
      ...{ ...axiosConfig }
    })
  }
}

export const boardApi = new Board()
