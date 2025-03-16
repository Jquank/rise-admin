import { createGlobalState } from '@vueuse/core'
import { ref } from 'vue'

export const useGlobalState = createGlobalState(() => {
  // 是否触发drop回调
  const isDropFlag = ref(false)
  // 是否手动执行drop回调
  const isHandleDropCallback = ref(false)
  // dataTransfer传递数据
  const dataTransfer = ref()

  return { isDropFlag, isHandleDropCallback, dataTransfer }
})
