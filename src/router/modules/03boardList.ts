import { RouteRecordRaw } from 'vue-router'
const routes: Array<RouteRecordRaw> = [
  {
    path: 'boards',
    name: 'boards',
    meta: { title: '看板列表', icon: 'shujukanban', deep: 1 },
    component: () => import('@/examples/board-list/board-list.vue')
  },
  {
    path: 'boards/:id',
    name: 'boards-detail',
    meta: {
      title: '看板详情',
      deep: 1,
      show: false,
      activeMenu: '/boards'
    },
    component: () => import('@/examples/board-list/board-detail.vue')
  },
  {
    path: 'boards/:id/edit',
    name: 'boards-edit',
    meta: {
      title: '编辑看板',
      deep: 1,
      show: false,
      activeMenu: '/boards'
    },
    component: () => import('@/examples/board-list/board-edit.vue')
  }
]
export default routes
