// 占位组件
import _a from './components/_a/_a.vue'

// ===== 表单：RForm（配置驱动，无需手写 el-form-item） =====
// 用法见 src/lib/components/form/types.ts 的 JSDoc
import { RForm } from './components/form'
export type { FormConfigItemType } from './components/form/types'

// ===== 分页：RPagination（自动管理 page/pageSize/total） =====
import { RPagination } from './components/pagination'
export type { SearchMethod } from './components/pagination/types'

// ===== 表格：RTable（配置驱动，内置分页） =====
// 自定义列：slot #column-{prop}="{ row, column }"
// 合并配置：mergeColumnConfig(serverColumns, customConfig)
import { RTable, mergeColumnConfig } from './components/table'

import { RGridCollapse } from './components/grid-collapse'

import {
  ChartRender,
  DropRender,
  DragWrapper,
  iconList
} from './components/drag-chart'
export type { ChartItemType } from './components/drag-chart/type'

export {
  _a,
  RForm,
  RPagination,
  RTable,
  mergeColumnConfig,
  RGridCollapse,
  ChartRender,
  DropRender,
  DragWrapper,
  iconList
}
