import { RouteRecordRaw } from 'vue-router'
const routes: Array<RouteRecordRaw> = [
  {
    path: 'dashboard-list',
    name: 'dashboard-list',
    meta: { title: '看板列表', icon: 'shujukanban', deep: 1, show: false },
    component: () => import('@/examples/dashboard/DashboardList.vue')
  },
  {
    path: 'dashboard-detail/:id',
    name: 'dashboard-detail',
    meta: {
      title: '看板详情',
      deep: 1,
      show: false,
      activeMenu: '/dashboard-list'
    },
    component: () => import('@/examples/dashboard/DashboardDetail.vue')
  }
]
export default routes
