import { RouteRecordRaw } from 'vue-router'
const routes: Array<RouteRecordRaw> = [
  {
    path: 'user-manage',
    name: 'user-manage',
    meta: {
      title: '用户管理',
      icon: 'user',
      deep: 1
    },
    component: () => import('@/views/userManage/user-list.vue')
  }
]
export default routes
