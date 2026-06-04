import { RouteRecordRaw } from 'vue-router'
const routes: Array<RouteRecordRaw> = [
  {
    path: 'hotspot',
    name: 'hotspot',
    meta: { title: 'AI热点成文', icon: 'wuguan', deep: 1 },
    redirect: { name: 'hotspot-content' },
    component: () => import('@/components/EmptyRouterView.vue'),
    children: [
      {
        path: '',
        name: 'hotspot-content',
        meta: { title: 'AI热点成文', deep: 2, show: false },
        component: () => import('@/views/hotspot/HotspotContent.vue')
      },
      {
        path: 'generate',
        name: 'hotspot-generate',
        meta: {
          title: '生成内容',
          deep: 2,
          show: false,
          activeMenu: '/hotspot'
        },
        component: () => import('@/views/hotspot/HotspotGenerate.vue')
      },
      {
        path: 'edit/:draftId?',
        name: 'hotspot-edit',
        meta: {
          title: '编辑发布',
          deep: 2,
          show: false,
          activeMenu: '/hotspot'
        },
        component: () => import('@/views/hotspot/HotspotEdit.vue')
      }
    ]
  }
]
export default routes
