import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { userApi, UserType } from '@/_api/index'

interface UserInfoType extends UserType.Res_getUser {
  mergedMenuAuth: string[]
  mergedBtnAuth: string[]
}

export const useCommonStore = defineStore('common', () => {
  // 折叠菜单标识
  const isCollapse = ref(false)
  // 路由初始化完成标识
  const initRouterFlag = ref(false)
  // 网站风格
  const webStyle = ref<number>(
    JSON.parse(localStorage.getItem('webStyle') || '2')
  )
  // 菜单数据
  const menuData = shallowRef<RouteRecordRaw[]>([])

  // 用户信息
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userInfo = ref<Partial<UserInfoType>>({})

  // 获取用户信息和菜单权限
  async function getUserInfoAndAuth() {
    try {
      const { data } = await userApi.getUser()
      // 合并多角色权限
      const menuAuth = data.roles
        .map((item) => item.menuAuth)
        .reduce((pre, cur) => pre.concat(cur), [])
      const btnAuth = data.roles
        .map((item) => item.btnAuth)
        .reduce((pre, cur) => pre.concat(cur), [])
      const mergedAuth = {
        mergedMenuAuth: [...new Set(menuAuth)],
        mergedBtnAuth: [...new Set(btnAuth)]
      }
      userInfo.value = { ...data, ...mergedAuth }
    } catch (error) {
      console.error(error)
      userInfo.value = {}
    }
  }
  return {
    isCollapse,
    initRouterFlag,
    webStyle,
    menuData,
    userInfo,
    getUserInfoAndAuth
  }
})
