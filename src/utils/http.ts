//文档地址：http://www.axios-js.com/zh-cn/docs/
import axios, { AxiosRequestConfig } from 'axios'
import { ElNotification } from 'element-plus'

// 创建axios实列
const axiosConfig: AxiosRequestConfig = {
  baseURL: '',
  timeout: 1 * 60 * 1000,
  withCredentials: true,
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
    return res.data
  },
  (err) => {
    // 非手动取消
    // if (!axios.isCancel(err)) {
    // }
    // removeRequestList(err.response ? err.response.config.url : undefined, err)
    // 410状态码为前后端特殊约定，表示需要前端展示错误信息的状态码，此时返回data，而不是reject，不会被catch到
    if (err.response && err.response.data) {
      const data = err.response.data
      if (data.status === 410) {
        return data
      }
    }
    ElNotification({
      message: err.message,
      type: 'error'
    })
    return Promise.reject(err)
  }
)

const $http = instance

export default $http
