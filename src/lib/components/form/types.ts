/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Component } from 'vue'

/**
 * RForm 表单配置项
 *
 * @description
 * RForm 是配置驱动的表单组件，通过 `config` 数组声明每个表单项，
 * 无需手写 `el-form-item` + `el-input/el-select` 模板。
 *
 * @example 基础用法（使用原生 select）
 * ```ts
 * const formConfig: FormConfigItemType[] = [
 *   { prop: 'name', label: '名称', type: 'input', required: true },
 *   {
 *     prop: 'type', label: '类型', type: 'select',
 *     compConfig: { customOptions: [{ label: 'A', value: 'a' }] }
 *   },
 * ]
 * ```
 *
 * @example 使用 selectObject（绑定对象，支持 customRequest）
 * ```ts
 * {
 *   prop: 'team', label: '团队', type: 'selectObject',
 *   compConfig: {
 *     customOptions: [...],
 *     events: { change: (val) => console.log(val) }
 *   }
 * }
 * ```
 *
 * @example textarea
 * ```ts
 * { prop: 'desc', label: '描述', type: 'input', compConfig: { type: 'textarea', rows: 4 } }
 * ```
 */
export interface FormConfigItemType {
  /** 表单项标签 */
  label: string
  /** 绑定的 model 字段名 */
  prop: string
  /**
   * 表单控件类型，支持字符串或直接传入组件
   * - 字符串：`'input'` | `'select'` | `'selectObject'` | `'checkbox'` | `'radio'` | `'editor'` | `'slider'`
   *   - `select`：原生下拉，绑定原始值（string/number），适合简单选项
   *   - `selectObject`：封装下拉，支持绑定对象、customRequest、code 等高级功能
   * - 组件：传入 Vue 组件引用，用于 RForm 未内置的控件
   */
  type?: string | Component
  /**
   * 当 `type` 为空时，直接渲染 `customType` 文本内容（常用于 readonly 展示）
   */
  customType?: Component | string
  /** 是否必填，为 true 时自动生成 required 校验规则 */
  required?: boolean
  /** 自定义校验规则数组（与 element-plus FormItemRule 一致） */
  rule?: unknown[]
  /**
   * 栅格列数配置
   * - `number`：固定占 N 列（如 1 = 一整行，2 = 半行）
   * - `object`：响应式断点配置 `{ xs, sm, md, lg, xl }`
   */
  colNumber?: number
  /**
   * 传递给 `el-form-item` 的 props，支持：
   * - `slots`: 自定义 label/error 插槽
   * - 其他 el-form-item 原生属性
   */
  itemConfig?: Record<string, any>
  /**
   * 传递给表单控件的 props，支持：
   * - `customOptions`: 下拉选项 `{ label, value }[]`
   * - `code`: 远程数据字典 code（配合内部数据源）
   * - `customRequest`: 自定义远程数据请求
   * - `events`: 事件回调 `{ change: fn, input: fn, ... }`（自动转 `onChange`/`onInput`）
   * - `filterable`, `allowCreate`, `clearable`, `disabled`, `placeholder` 等控件原生属性
   */
  compConfig?: Record<string, any>
}
