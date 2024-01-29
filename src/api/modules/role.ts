/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ResponseType } from '@/api/responseType'
import { $http } from '@/api/http'

export type Res_getRole = any

class Role {
  getRole(): Promise<ResponseType<Res_getRole[]>> {
    return $http.get('/mock/role')
  }
  getRoleAuthById(
    id: string
  ): Promise<ResponseType<{ menu: string[]; btn: string[] }>> {
    const roleMenu = JSON.parse(
      localStorage.getItem(`role-${id}-menu`) || 'null'
    )
    const roleBtn = JSON.parse(localStorage.getItem(`role-${id}-btn`) || 'null')
    return Promise.resolve({
      code: 0,
      data: {
        menu: roleMenu || (id === 'admin' ? [] : ['home', 'auth-manage']),
        btn: roleBtn || (id === 'admin' ? ['VIEW', 'ADD'] : ['VIEW'])
      },
      message: 'success'
    })
  }

  putRoleAuthById(
    id: string,
    data: { menu: string[]; btn: string[] }
  ): Promise<ResponseType<any>> {
    localStorage.setItem(`role-${id}-menu`, JSON.stringify(data.menu))
    localStorage.setItem(`role-${id}-btn`, JSON.stringify(data.btn))
    return Promise.resolve({
      code: 0,
      data: null,
      message: 'success'
    })
  }
}

export const roleApi = new Role()
