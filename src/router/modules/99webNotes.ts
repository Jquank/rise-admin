import { RouteRecordRaw } from 'vue-router'
import EmptyRouterView from '@/components/EmptyRouterView.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: 'WebNotes',
    name: 'WebNotes',
    meta: { title: '个人随记', icon: 'shiyongwendang', deep: 1 },
    component: EmptyRouterView,
    children: [
      {
        path: 'LyricsEffect',
        name: 'LyricsEffect',
        meta: { title: '歌词滚动', deep: 2, noUseGlobalScrollbar: true },
        component: () => import('@/views/webNotes/lyricsEffect/index.vue')
      },
      {
        path: 'eventloop',
        name: 'eventloop',
        meta: { title: '动画卡顿', deep: 2 },
        component: () => import('@/views/webNotes/eventloop/index.vue')
      }
    ]
  }
]
export default routes
