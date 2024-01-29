import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { userApi } from '@/api/index'

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
      userInfo.value = data
      let menuAuth: string[] = []
      let btnAuth: string[] = []
      if (userInfo.value.roles.length) {
        const { data } = await userApi.getUserAuth(userInfo.value.roles)
        menuAuth = data.menu
        btnAuth = data.btn
      }
      userInfo.value.menuAuth = menuAuth
      userInfo.value.btnAuth = btnAuth
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
