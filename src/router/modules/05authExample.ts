import { RouteRecordRaw } from 'vue-router'
import EmptyRouterView from '@/components/EmptyRouterView.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: 'auth',
    name: 'auth-manage',
    meta: { title: '权限测试', icon: 'zhanghaoquanxianguanli', deep: 1 },
    component: EmptyRouterView,
    children: [
      {
        path: 'menu-auth',
        name: 'menu-auth',
        meta: { title: '菜单权限', deep: 2 },
        component: () => import('@/examples/authManage/MenuAuth.vue')
      },
      {
        path: 'button-auth',
        name: 'button-auth',
        meta: { title: '按钮权限', deep: 2 },
        component: () => import('@/examples/authManage/ButtonAuth.vue')
      }
    ]
  }
]
export default routes
