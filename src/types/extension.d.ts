/* eslint-disable @typescript-eslint/no-unused-vars */
import type { RouteMeta, RouteRecordName } from 'vue-router'
import type { AxiosRequestConfig } from 'axios'

declare module 'vue-router' {
  export interface RouteMeta {
    title: string
    /**
     * 图标icon
     */
    icon?: string
    /**
     * 菜单深度，用以添加类名，设置统一缩宽度
     */
    deep?: number
    /**
     * 是否展示在菜单栏
     */
    show?: boolean
    /**
     * 外层菜单排序, 暂时未用，使用路由文件名加数字排序
     */
    order?: number
    /**
     * 需要激活的菜单，用于进入详情页后菜单栏的高亮
     */
    activeMenu?: string
    /**
     * 是否不使用全局的el-scrollbar，el-scrollbar不能继承高度，某些情况不需要它
     */
    noUseGlobalScrollbar?: boolean
  }
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    cancelRepeatRequest?: boolean
  }
}
