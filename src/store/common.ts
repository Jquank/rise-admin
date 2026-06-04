import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { userApi } from '@/_api/index'

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
  const userInfo = ref<Record<string, any>>({})

  // 获取用户信息和菜单权限
  async function getUserInfoAndAuth() {
    try {
      const { data } = await userApi.getUser()
      // 合并多角色权限（空安全处理）
      const roles = data.roles || []
      const menuAuth: string[] = []
      const btnAuth: string[] = []
      roles.forEach((item: any) => {
        if (item.permissions) {
          menuAuth.push(
            ...item.permissions.filter((v: string) => v.startsWith('menu:'))
          )
          btnAuth.push(
            ...item.permissions.filter((v: string) => v.startsWith('btn:'))
          )
        }
      })
      const mergedAuth = {
        mergedMenuAuth: [...new Set(menuAuth)],
        mergedBtnAuth: [...new Set(btnAuth)]
      }
      userInfo.value = { ...data, ...mergedAuth }
    } catch (error) {
      console.error(error)
      userInfo.value = { mergedMenuAuth: ['menu:home'], mergedBtnAuth: [] }
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
