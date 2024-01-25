import $http from '@/utils/http'
// import type { UserInfo } from '@/types/model/login'

interface LoginParams {
  username: string
  passward: string
}

// 模拟token，正常是一串数字
export const getToken = (params: LoginParams) => {
  return $http.post('/rise/user/getToken', params)
}
export const getUserInfo = () => {
  return $http.post('/rise/user/getUserInfo')
}

export const getRolesList = () => {
  return $http.get('/rise/role')
}

export const getMenuByRole = (role: string[]) => {
  let res: string[] = []
  if (role[0] === 'admin') {
    res = JSON.parse(localStorage.getItem('menuAuth-admin') || '[]')
  } else {
    res = JSON.parse(
      localStorage.getItem('menuAuth-user') || '["home", "menu-auth"]'
    )
  }
  return res
}
