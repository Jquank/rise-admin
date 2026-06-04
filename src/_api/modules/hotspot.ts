/* eslint-disable @typescript-eslint/no-explicit-any */
import { $http } from '../http'
import { ResponseType, AxiosRequestConfig } from '../responseType'

export type Res_getHotspotCategories = {
  id: number
  name: string
  sortOrder: number
}[]

export type Res_getHotspots = {
  id: number
  title: string
  summary: string | null
  source: string | null
  region: string | null
  heatIndex: number
  localImageUrl: string | null
  publishDate: string
  createdAt: string
  categoryId: number
  category: { id: number; name: string; sortOrder: number }
}[]

interface Body_CreateHotspot {
  title: string
  summary?: string
  source?: string
  heatIndex?: number
  publishDate?: string
  categoryId: number
}

class Hotspot {
  getCategories(
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<Res_getHotspotCategories>> {
    return $http.get('/api/hotspot/categories', axiosConfig)
  }

  getByDate(
    date: string,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<Res_getHotspots>> {
    return $http.get('/api/hotspot', { ...axiosConfig, params: { date } })
  }

  refresh(
    date: string,
    hotspots: Body_CreateHotspot[],
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.post('/api/hotspot/refresh', { date, hotspots }, axiosConfig)
  }

  create(
    data: Body_CreateHotspot,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.post('/api/hotspot', data, axiosConfig)
  }

  update(
    id: number,
    data: Partial<Body_CreateHotspot>,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.put(`/api/hotspot/${id}`, data, axiosConfig)
  }

  delete(
    id: number,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.delete(`/api/hotspot/${id}`, axiosConfig)
  }

  generate(
    data: {
      hotspotIds: number[]
      targetFormat: string
      style: string
      minWords?: number
      maxWords?: number
      maxImages?: number
    },
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<
    ResponseType<{
      content: string
      hotspots: any[]
      generatedImages: string[]
      config: any
    }>
  > {
    return $http.post('/api/hotspot/generate', data, axiosConfig)
  }

  refreshAi(
    date: string,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.post('/api/hotspot/refresh-ai', { date }, axiosConfig)
  }

  refreshCategoryAi(
    date: string,
    categoryId: number,
    axiosConfig: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.post('/api/hotspot/refresh-category-ai', { date, categoryId }, axiosConfig)
  }
}

export const hotspotApi = new Hotspot()
