import { RouteRecordRaw } from 'vue-router'
import EmptyRouterView from '@/components/EmptyRouterView.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: 'system-manage',
    name: 'system-manage',
    meta: { title: '系统管理', icon: 'fenzuguanli', deep: 1 },
    component: EmptyRouterView,
    children: [
      {
        path: 'role',
        name: 'role',
        meta: { title: '角色管理', deep: 2 },
        component: () => import('@/views/systemManage/RoleManage.vue')
      }
    ]
  }
]
export default routes
