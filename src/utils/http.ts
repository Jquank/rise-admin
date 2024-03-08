//文档地址：http://www.axios-js.com/zh-cn/docs/
import axios, { AxiosRequestConfig } from 'axios'
import { ElNotification } from 'element-plus'
import { ElMessage } from 'element-plus'

// 创建axios实列
const axiosConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_HTTP_URL || '',
  timeout: 1 * 60 * 1000,
  // withCredentials: true,
  cancelRepeatRequest: false // 是否取消重复请求
}
const instance = axios.create(axiosConfig)
const AUTH_TOKEN = sessionStorage.getItem('token') || ''
instance.defaults.headers.common['Authorization'] = AUTH_TOKEN

// 请求拦截
instance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
// 响应拦截
instance.interceptors.response.use(
  (res) => {
    return res.data ? res.data : res
  },
  (error) => {
    // 非手动取消
    // if (!axios.isCancel(err)) {
    // }
    // removeRequestList(err.response ? err.response.config.url : undefined, err)
    const response = error.response
    if (response.status === 410) {
      ElMessage.error(response.data.message || '请求失败')
    } else {
      ElNotification.error(error.message || '系统出错，请联系管理员')
    }
    return Promise.reject(error)
  }
)
const $http = instance
export default $http
