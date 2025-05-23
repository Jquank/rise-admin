import { RouteRecordRaw } from 'vue-router'
import EmptyRouterView from '@/components/EmptyRouterView.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: 'components',
    name: 'components',
    meta: { title: '组件', icon: 'yingyongguanli', deep: 1 },
    component: EmptyRouterView,
    children: [
      {
        path: 'tinymce',
        name: 'tinymce',
        meta: { title: '富文本编辑器', deep: 2 },
        component: () => import('@/examples/editor/editorTinymce.vue')
      },
      {
        path: 'download',
        name: 'download',
        meta: { title: '文件下载', deep: 2 },
        component: () => import('@/examples/download/DownloadEx.vue')
      },
      {
        path: 'icons',
        name: 'icons',
        meta: { title: '字体图标', deep: 2 },
        component: () => import('@/examples/icons/iconsList.vue')
      },
      {
        path: 'grid-collapse',
        name: 'grid-collapse',
        meta: { title: '栅格折叠', deep: 2 },
        component: () => import('@/examples/gridCollapse/index.vue')
      },
      {
        path: 'form',
        name: 'form',
        meta: { title: '配置化表单', deep: 2 },
        component: () => import('@/examples/form/index.vue')
      },
      {
        path: 'table',
        name: 'table',
        meta: { title: '表格', deep: 2, noUseGlobalScrollbar: true },
        component: () => import('@/examples/table/index.vue')
      }
    ]
  }
]
export default routes
