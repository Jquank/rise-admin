/* eslint-disable @typescript-eslint/no-explicit-any */
import { $http } from '../http'
import { ResponseType, AxiosRequestConfig } from '../responseType'

// ========== 模型 ==========
export type Res_AiImageModel = {
  id: number
  name: string
  displayName: string
  apiUrl: string
  defaultSize: string
  isActive: boolean
  price: number
  createdAt: string
  _count: { records: number }
}

// ========== 提示词模板 ==========
export type Res_AiImagePrompt = {
  id: number
  name: string
  content: string
  isSystem: boolean
  userId: number | null
  size: string | null
  modelId: number | null
  createdAt: string
  user?: { id: number; username: string } | null
}

// ========== 生成记录 ==========
export type Res_AiImageRecord = {
  id: number
  modelId: number
  promptId: number | null
  prompt: string
  size: string
  imageUrl: string
  localPath: string
  createdAt: string
  model: { name: string; displayName: string }
  promptRel: { name: string } | null
}

// ========== 请求体 ==========
export interface Body_GenerateImage {
  modelId: number
  promptId?: number
  prompt?: string
  size?: string
  n?: number
  watermark?: boolean
  images?: string[]
  imageSize?: string
}

export interface Body_CreateModel {
  name: string
  displayName: string
  apiUrl: string
  defaultSize?: string
}

export interface Body_UpdateModel {
  name?: string
  displayName?: string
  apiUrl?: string
  defaultSize?: string
  isActive?: boolean
}

export interface Body_CreatePrompt {
  name: string
  content: string
  size?: string
  modelId?: number
}

export interface Body_UpdatePrompt {
  name?: string
  content?: string
  size?: string
  modelId?: number
}

class AiImage {
  // ========== 模型 CRUD ==========
  getModels(
    config: AxiosRequestConfig = {}
  ): Promise<ResponseType<Res_AiImageModel[]>> {
    return $http.get('/api/ai-image/models', config)
  }

  createModel(
    data: Body_CreateModel,
    config: AxiosRequestConfig = {}
  ): Promise<ResponseType<Res_AiImageModel>> {
    return $http.post('/api/ai-image/models', data, config)
  }

  updateModel(
    id: number,
    data: Body_UpdateModel,
    config: AxiosRequestConfig = {}
  ): Promise<ResponseType<Res_AiImageModel>> {
    return $http.put(`/api/ai-image/models/${id}`, data, config)
  }

  deleteModel(
    id: number,
    config: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.delete(`/api/ai-image/models/${id}`, config)
  }

  // ========== 提示词 CRUD ==========
  getPrompts(
    config: AxiosRequestConfig = {}
  ): Promise<ResponseType<Res_AiImagePrompt[]>> {
    return $http.get('/api/ai-image/prompts', config)
  }

  createPrompt(
    data: Body_CreatePrompt,
    config: AxiosRequestConfig = {}
  ): Promise<ResponseType<Res_AiImagePrompt>> {
    return $http.post('/api/ai-image/prompts', data, config)
  }

  updatePrompt(
    id: number,
    data: Body_UpdatePrompt,
    config: AxiosRequestConfig = {}
  ): Promise<ResponseType<Res_AiImagePrompt>> {
    return $http.put(`/api/ai-image/prompts/${id}`, data, config)
  }

  deletePrompt(
    id: number,
    config: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.delete(`/api/ai-image/prompts/${id}`, config)
  }

  // ========== 生成图片 ==========
  generate(
    data: Body_GenerateImage,
    config: AxiosRequestConfig = {}
  ): Promise<ResponseType<Res_AiImageRecord[]>> {
    return $http.post('/api/ai-image/generate', data, config)
  }

  // ========== 参考图片上传 ==========
  uploadImage(
    file: File,
    config: AxiosRequestConfig = {}
  ): Promise<ResponseType<{ url: string; filename: string }>> {
    const formData = new FormData()
    formData.append('file', file)
    return $http.post('/api/ai-image/upload', formData, {
      ...config,
      headers: { 'Content-Type': 'multipart/form-data', ...config.headers }
    })
  }

  // ========== 生成记录 ==========
  getRecords(
    params?: { page?: number; pageSize?: number; modelId?: number },
    config: AxiosRequestConfig = {}
  ): Promise<
    ResponseType<{
      records: Res_AiImageRecord[]
      total: number
      page: number
      pageSize: number
    }>
  > {
    return $http.get('/api/ai-image/records', { ...config, params })
  }

  deleteRecord(
    id: number,
    config: AxiosRequestConfig = {}
  ): Promise<ResponseType<any>> {
    return $http.delete(`/api/ai-image/records/${id}`, config)
  }

  deleteAllRecords(
    config: AxiosRequestConfig = {}
  ): Promise<ResponseType<{ deleted: number }>> {
    return $http.delete('/api/ai-image/records', config)
  }
}

export const aiImageApi = new AiImage()
