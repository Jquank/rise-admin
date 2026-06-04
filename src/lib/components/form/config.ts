import {
  ElInput,
  ElCheckbox,
  ElSlider,
  ElSelect,
  ElRadioGroup
} from 'element-plus'
import SelectObject from './components/r-select.vue'
import Editor from './components/r-editor.vue'

/**
 * RForm 控件映射表（element-plus 2.14+ 原生 options prop）
 *
 * - `input`        → ElInput
 * - `select`       → ElSelect
 * - `selectObject` → RSelect（封装下拉，支持绑定整个对象、customRequest、code）
 * - `checkbox`     → ElCheckbox
 * - `radio`        → ElRadioGroup
 * - `editor`       → REditor（富文本）
 * - `slider`       → ElSlider
 */
export const compMap: Record<string, any> = {
  input: ElInput,
  select: ElSelect,
  selectObject: SelectObject,
  checkbox: ElCheckbox,
  radio: ElRadioGroup,
  editor: Editor,
  slider: ElSlider
}
