/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ResponseType } from '@/api/responseType'

class User {
  postUser(data: {
    username: string
    password: string
  }): Promise<ResponseType<string>> {
    return Promise.resolve({
      code: 0,
      data: data.username,
      message: '成功'
    })
  }

  getUser(): Promise<ResponseType<typeof res>> {
    const token = sessionStorage.getItem('token')
    const res = {
      id: +(Math.random() * 10).toFixed(),
      username: token,
      roles: [token]
    }
    return Promise.resolve({
      code: 0,
      data: res,
      message: '成功'
    })
  }

  getUserMenu(data: string[]): Promise<ResponseType<typeof res>> {
    const token = sessionStorage.getItem('token')
    const res = token === 'admin' ? [] : ['home', 'menu-auth']
    return Promise.resolve({
      code: 0,
      data: res,
      message: '成功'
    })
  }
}

export const userApi = new User()
