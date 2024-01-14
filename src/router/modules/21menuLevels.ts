import { RouteRecordRaw } from 'vue-router'
import EmptyRouterView from '@/components/EmptyRouterView.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: 'menu-levels',
    name: 'menu-levels',
    meta: { title: '多级菜单', icon: 'tubiao-zhuzhuangtu', deep: 1 },
    component: EmptyRouterView,
    children: [
      {
        path: 'menu1',
        name: 'level1',
        meta: { title: '菜单1', deep: 2 },
        component: () => import('@/examples/menuLevels/index.vue'),
        children: [
          {
            path: 'menu1-1',
            name: 'level1-1',
            meta: { title: '菜单1-1', deep: 3 },
            component: () => import('@/examples/menuLevels/index1.vue'),
            children: [
              {
                path: 'menu1-1-1',
                name: 'level1-1-1',
                meta: { title: '菜单1-1-1', deep: 4 },
                component: () => import('@/examples/menuLevels/index2.vue')
              }
            ]
          },
          {
            path: 'menu1-2',
            name: 'level1-2',
            meta: { title: '菜单1-2', deep: 3 },
            component: () => import('@/examples/menuLevels/index3.vue')
          }
        ]
      }
    ]
  }
]
export default routes
