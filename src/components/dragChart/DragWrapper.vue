<template>
  <div
    @dragstart="dragstart($event)"
    @dragend="dragend"
    draggable="true"
    class="drag-wrapper"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  import { useGlobalState } from './useGlobalState'
  import { DataTransferKeyType } from './type'
  const globalState = useGlobalState()
  const props = defineProps({
    nodeData: {
      type: Object,
      default: () => ({})
    }
  })
  const dragstart = (e: DragEvent) => {
    globalState.isDropFlag.value = false
    globalState.isHandleDropCallback.value = false
    globalState.dataTransfer.value = {
      _mark: DataTransferKeyType.key,
      ...props.nodeData
    }
    // e.dataTransfer!.setData(
    //   DataTransferKeyType.key,
    //   JSON.stringify({ _mark: DataTransferKeyType.key, ...props.nodeData })
    // )
    e.dataTransfer!.effectAllowed = 'move'
  }
  const dragend = () => {
    // 没有触发drop事件，则手动调用drop回调
    if (globalState.isDropFlag.value === false) {
      globalState.isHandleDropCallback.value = true
    }
  }
</script>

<style lang="less" scoped>
  .drag-wrapper {
    cursor: move;
    user-select: none;
  }
</style>
