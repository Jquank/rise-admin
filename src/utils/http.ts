//文档地址：http://www.axios-js.com/zh-cn/docs/
import axios, { AxiosRequestConfig } from 'axios'
import { ElNotification } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
// 创建axios实列
const axiosConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_HTTP_URL || '',
  timeout: 1 * 60 * 1000,
  // withCredentials: true,
  cancelRepeatRequest: false // 是否取消重复请求
}
const instance = axios.create(axiosConfig)
const token = localStorage.getItem('token') || ''
instance.defaults.headers.common['Authorization'] = token

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
    if (String(response.status).startsWith('4')) {
      if (response.status === 401) {
        localStorage.removeItem('token')
        router.push('/login')
      }
      ElMessage.error(response.data?.message || '请求失败')
    } else {
      ElNotification.error(error?.message || '系统出错，请联系管理员')
    }
    return Promise.reject(response.data ? response.data : error)
  }
)
const $http = instance
export default $http
