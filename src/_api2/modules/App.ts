/* eslint-disable @typescript-eslint/no-explicit-any */
import { $http } from '../http'

import { ResponseType, AxiosRequestConfig } from '../responseType'

class App {
  /**  */
  get(axiosConfig: AxiosRequestConfig = {}): Promise<ResponseType<string>> {
    return $http.request({ url: '/', method: 'get', ...{ ...axiosConfig } })
  }
}

export const AppApi = new App()
