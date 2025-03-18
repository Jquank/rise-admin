import {
  ElInput,
  ElSelect,
  ElCheckbox,
  ElRadioGroup,
  ElRadio,
  ElOption
} from 'element-plus'
import Editor from '@/components/EditorTinymce.vue'
export const compMap = {
  input: ElInput,
  select: ElSelect,
  checkbox: ElCheckbox,
  radio: ElRadioGroup,
  editor: Editor
}

export const childCompMap: Record<string, unknown> = {
  radio: ElRadio,
  select: ElOption
}
