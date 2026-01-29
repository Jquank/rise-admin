import { RouteRecordRaw } from 'vue-router'
const routes: Array<RouteRecordRaw> = [
  {
    path: 'system-manage',
    name: 'system-manage',
    meta: { title: '系统管理', icon: 'fenzuguanli', deep: 1 },
    children: [
      {
        path: 'role',
        name: 'role-manage',
        meta: { title: '角色管理', deep: 2 },
        component: () => import('@/views/system-manage/role-manage.vue')
      },
      {
        path: 'enum',
        name: 'enum-manage',
        meta: { title: '枚举管理', deep: 2, noUseGlobalScrollbar: true },

        component: () => import('@/views/system-manage/enum/index.vue')
      }
    ]
  }
]
export default routes
