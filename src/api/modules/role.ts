/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ResponseType } from '@/api/responseType'
import { $http } from '@/api/http'

export type Res_getRole = any

class Role {
  getRole(): Promise<ResponseType<Res_getRole[]>> {
    return $http.get('/mock/role')
  }
  getRoleMenuById(id: string): Promise<ResponseType<string[]>> {
    const roleMenu = JSON.parse(
      localStorage.getItem(`role-${id}-menu`) || 'null'
    )
    if (!roleMenu) {
      return Promise.resolve({
        code: 0,
        data: id === 'admin' ? [] : ['home', 'menu-auth'],
        message: 'success'
      })
    }
    return Promise.resolve({
      code: 0,
      data: roleMenu,
      message: 'success'
    })
  }

  putRoleMenuById(id: string, data: string[]): Promise<ResponseType<any>> {
    localStorage.setItem(`role-${id}-menu`, JSON.stringify(data))
    return Promise.resolve({
      code: 0,
      data: null,
      message: 'success'
    })
  }
}

export const roleApi = new Role()
