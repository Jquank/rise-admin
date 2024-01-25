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
    return res.data ? res.data : res
  },
  (err) => {
    // 非手动取消
    // if (!axios.isCancel(err)) {
    // }
    // removeRequestList(err.response ? err.response.config.url : undefined, err)
    ElNotification({
      message: err.message || '系统出错，请联系管理员',
      type: 'error'
    })
    return Promise.reject(err)
  }
)
// const $http = {
//   get(url: string, params = {}, config?: AxiosRequestConfig) {
//     params = config ? { params: params, ...config } : { params: params }
//     return instance
//       .get(url, params)
//       .then((res) => {
//         return res
//       })
//       .catch((err) => {
//         return Promise.reject(err)
//       })
//   },
//   post(url: string, params = {}, config?: AxiosRequestConfig) {
//     return instance
//       .post(url, params, config)
//       .then((res) => {
//         return res
//       })
//       .catch((err) => {
//         return Promise.reject(err)
//       })
//   },
//   put(url: string, params = {}, config?: AxiosRequestConfig) {
//     return instance
//       .put(url, params, config)
//       .then((res) => {
//         return res
//       })
//       .catch((err) => {
//         return Promise.reject(err)
//       })
//   },
//   delete(url: string, params = {}, config?: AxiosRequestConfig) {
//     params = config ? { data: params, ...config } : { data: params }
//     return instance
//       .delete(url, params)
//       .then((res) => {
//         return res
//       })
//       .catch((err) => {
//         return Promise.reject(err)
//       })
//   },
//   ex: <T>(_: string, params: T) => {
//     // return new Promise((resolve) => {
//     //   setTimeout(() => {
//     //     resolve(params)
//     //   }, 1000)
//     // })
//     return Promise.resolve(params)
//   }
// }
const $http = instance
export default $http
