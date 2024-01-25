import $http from '@/utils/http'

import { ResponseType } from './responseType'

class User {
  getToken(params: {
    username: string
    password: string
  }): Promise<ResponseType<string>> {
    return $http.post('/rise/user/getToken', params)
  }
}

export const userApi = new User()
