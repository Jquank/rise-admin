/* eslint-disable @typescript-eslint/no-explicit-any */
import { $http } from '../http'

import { ResponseType, AxiosRequestConfig } from '../responseType'

interface Dto_CardDto {
  id?: number
  title: string
  value: string
  type: string
  posi: string
  config: string
  data: string
}
interface Dto_UpdateBoardDto {
  id: number
  cards?: Dto_CardDto[]
  title: string
  desc: string
}
interface Dto_CreateBoardDto {
  title: string
  desc: string
}
export type Body_postBoard = Dto_CreateBoardDto
export type Body_putBoard = Dto_UpdateBoardDto
export interface Res_getBoardById {}

class Board {
  /**  */
  postBoard(
    data: Body_postBoard,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.request({
      url: '/board',
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
      url: '/board',
      method: 'put',
      ...{ data, ...axiosConfig }
    })
  }

  /**  */
  getBoard(axiosConfig: AxiosRequestConfig = {}): Promise<ResponseType<any>> {
    return $http.request({
      url: '/board',
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
      url: `/board/${id}`,
      method: 'delete',
      ...{ ...axiosConfig }
    })
  }

  /**  */
  getBoardById(
    id: number,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<Res_getBoardById>> {
    return $http.request({
      url: `/board/${id}`,
      method: 'get',
      ...{ ...axiosConfig }
    })
  }
}

export const BoardApi = new Board()
