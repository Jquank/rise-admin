/* eslint-disable @typescript-eslint/no-explicit-any */
import { reactive } from 'vue'
// 使用reactive做简单的全局状态
const globalState = reactive<{
  dataTransfer: any
}>({
  // dataTransfer传递数据
  dataTransfer: null
})

export const useGlobalState = () => {
  return {
    globalState
  }
}
