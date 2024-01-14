import $http from '@/utils/http'
// import type { UserInfo } from '@/types/model/login'

interface LoginParams {
  username: string
  passward: string
}

// 模拟token，正常是一串数字
export const getToken = (params: LoginParams) => {
  return $http.ex('/api/getToken', params)
}
export const getUserInfo = () => {
  const token = JSON.parse(sessionStorage.getItem('token') || 'null')
  if (!token) {
    console.error('token is error')
  }
  const res = token
    ? {
        username: token.username,
        roles: [token.username]
      }
    : {}
  return $http.ex('/api/getUserInfo', res)
}

// 真实接口无法推断类型，这里需要借助插件配合后端自动生成接口调用函数，todo：写一个vscode插件配合swagger生成类型接口函数
export const getRolesList = () => {
  return $http.get('/role/list')
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

  return $http.ex('/api/getMenuByRole', res)
}
