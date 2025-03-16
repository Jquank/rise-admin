import { RouteRecordRaw } from 'vue-router'
import EmptyRouterView from '@/components/EmptyRouterView.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: 'list-table',
    name: 'list-table',
    meta: { title: '列表页', icon: 'biaodanzujian-biaoge', deep: 1 },
    component: EmptyRouterView,
    children: [
      {
        path: 'complex-table',
        name: 'complex-table',
        meta: {
          title: '查询表格(带缓存)',
          deep: 2,
          noUseGlobalScrollbar: true
        },
        component: () => import('@/examples/tableList/ComplexTable.vue'),
        children: [
          {
            path: 'detail/:id',
            name: 'complex-table-detail',
            meta: {
              title: '查询表格详情页',
              deep: 3,
              show: false,
              activeMenu: '/list-table/complex-table'
            },
            component: () =>
              import('@/examples/tableList/ComplexTableDetail.vue')
          }
        ]
      },
      {
        path: 'card-list',
        name: 'card-list',
        meta: { title: '卡片列表', deep: 2 },
        component: () => import('@/examples/tableList/CardList.vue')
      },
      {
        path: 'card-list/:id',
        name: 'card-list-detail',
        meta: {
          title: '卡片列表详情页',
          deep: 2,
          show: false,
          activeMenu: '/list-table/card-list'
        },
        component: () => import('@/views/dashboard/EditPage.vue')
      }
    ]
  }
]
export default routes
