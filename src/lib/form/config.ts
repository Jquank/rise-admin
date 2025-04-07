import { ElInput, ElCheckbox } from 'element-plus'
import Radio from './components/r-radio.vue'
import Select from './components/r-select.vue'
import Editor from '@/components/EditorTinymce.vue'

export const compMap = {
  input: ElInput,
  select: Select,
  checkbox: ElCheckbox,
  radio: Radio,
  editor: Editor
}
