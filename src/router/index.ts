import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import {
  splicePath,
  findPathTreeByValue,
  deleteNodeFromTreeList
} from '@/utils/common'
import { useCommonStore } from '@/store/common'

const routerImport: Array<RouteRecordRaw> = []
const routerModules = import.meta.glob('./modules/*.ts')

/** 获取modules文件夹下的所有路由导入(并发promise，并按顺序push)，表单配置从server获取同理 */
const getRouterAsync = async () => {
  routerImport.length = 0
  const arr = Object.values(routerModules).map(async (r) => await r())
  for (let i = 0, len = arr.length; i < len; i++) {
    const res: unknown = await arr[i]
    ;(res as { default: RouteRecordRaw[] }).default.forEach((item) => {
      routerImport.push(item)
    })
  }
  routerImport.sort((a, b) => (a.meta?.order || 0) - (b.meta?.order || 0))
}
const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    meta: { title: '登录' },
    component: () => import('@/views/login/user-login.vue')
  },
  {
    path: '/',
    name: 'layout',
    meta: { title: 'layout' },
    redirect: '/Home',
    component: () => import('@/layout/LayoutMain.vue'),
    children: [
      {
        path: 'home',
        name: 'home',
        meta: { title: '首页', icon: 'home1', deep: 1 },
        component: () => import('@/views/home/home-page.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__MICRO_APP_BASE_ROUTE__ || '/'
  ),
  routes
})

router.beforeEach(async (to) => {
  document.title = to.meta.title
  if (!routerImport.length) {
    await getRouterAsync()
    // 挂载全数据到routes.options上
    const layoutRoutes = routes.find((r) => r.name === 'layout')!
    layoutRoutes.children = [...layoutRoutes.children!, ...routerImport]
    // path 拼接，适配el-menu
    splicePath(layoutRoutes.children)
  }

  const token = localStorage.getItem('token') || ''
  if (!token) {
    if (to.name === 'login') {
      return
    } else {
      return '/login'
    }
  } else {
    if (to.name === 'login') {
      return
    }
    // pinia须在router实例化后使用
    const commonStore = useCommonStore()
    if (commonStore.initRouterFlag) return
    const layoutRoutes = routes.find((r) => r.name === 'layout')!

    // 清空menuData和所有router
    commonStore.menuData = []
    layoutRoutes.children?.forEach((r) => {
      if (r.name !== 'home' && router.hasRoute(r.name!))
        router.removeRoute(r.name!)
    })

    // 获取用户信息
    await commonStore.getUserInfoAndAuth()
    const userInfo = commonStore.userInfo

    // 匹配出权限路由（包含详情）
    const resMap = findPathTreeByValue(
      layoutRoutes.children!,
      'name',
      userInfo.mergedMenuAuth.map((v) => v.split(':')[1])
    )
    // 添加权限路由
    resMap.forEach((r) => {
      if (!router.hasRoute(r.name!)) router.addRoute('layout', r)
    })
    // 添加完后，删除详情节点
    deleteNodeFromTreeList(resMap, false, 'meta.show')
    commonStore.menuData = resMap

    // 添加404
    router.addRoute('layout', {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/other/NotFound.vue'),
      meta: { title: '404' }
    })
    commonStore.initRouterFlag = true
    // await router.replace(router.currentRoute.value.fullPath)
    return to.fullPath
  }
})

export default router
