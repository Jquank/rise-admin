import { RouteRecordRaw } from 'vue-router'
import EmptyRouterView from '@/components/EmptyRouterView.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: 'charts',
    name: 'charts',
    meta: { title: '图表', icon: 'tubiao-zhuzhuangtu', deep: 1 },
    component: EmptyRouterView,
    children: [
      {
        path: 'bar-chart',
        name: 'BarDelayEchart',
        meta: { title: '柱状图', deep: 2, noUseGlobalScrollbar: true },
        component: () => import('@/examples/charts/index.vue')
      },
      {
        path: 'line-chart',
        name: 'LineEchart',
        meta: { title: '折线图', deep: 2, noUseGlobalScrollbar: true },
        component: () => import('@/examples/charts/index.vue')
      }
    ]
  }
]
export default routes
