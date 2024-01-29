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

  getUserAuth(
    _: string[]
  ): Promise<ResponseType<{ menu: string[]; btn: string[] }>> {
    const token = sessionStorage.getItem('token')
    const menuStoreage = JSON.parse(
      localStorage.getItem(`role-${token}-menu`) || 'null'
    )
    const btnStoreage = JSON.parse(
      localStorage.getItem(`role-${token}-btn`) || 'null'
    )
    const defaultMenu = token === 'admin' ? [] : ['home', 'auth-manage']
    const defaultBtn = token === 'admin' ? ['VIEW', 'ADD'] : ['VIEW']
    return Promise.resolve({
      code: 0,
      data: {
        menu: menuStoreage || defaultMenu,
        btn: btnStoreage || defaultBtn
      },
      message: '成功'
    })
  }
}

export const userApi = new User()
