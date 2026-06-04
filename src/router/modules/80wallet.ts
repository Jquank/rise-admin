import { RouteRecordRaw } from 'vue-router'
const routes: Array<RouteRecordRaw> = [
  {
    path: 'transaction-history',
    name: 'transaction-history',
    meta: {
      title: '交易记录',
      icon: 'kuaijiezhifu',
      deep: 1
    },
    component: () => import('@/views/wallet/transaction-list.vue')
  }
]
export default routes
