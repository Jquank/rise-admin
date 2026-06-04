import { RouteRecordRaw } from 'vue-router'
const routes: Array<RouteRecordRaw> = [
  {
    path: 'ai-image',
    name: 'ai-image',
    meta: {
      title: 'AI生图',
      icon: 'ai',
      deep: 1,
      noUseGlobalScrollbar: true
    },
    component: () => import('@/views/aiImage/ai-image-generate.vue')
  }
]
export default routes
