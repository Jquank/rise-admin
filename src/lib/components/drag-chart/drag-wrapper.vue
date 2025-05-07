<template>
  <div
    @dragstart="dragstart"
    @drag="drag"
    @dragend="dragend"
    draggable="true"
    data-drag-wrapper="true"
    class="_drag-wrapper"
    unselectable="on">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  import { useGlobalState } from './use-global-state'
  const { globalState } = useGlobalState()
  const props = defineProps({
    nodeData: {
      type: Object,
      default: () => ({})
    }
  })
  const dragstart = (e: DragEvent) => {
    globalState.dataTransfer = {
      ...props.nodeData
    }
    e.dataTransfer!.effectAllowed = 'move'
  }
  const drag = () => {}
  const dragend = () => {}
</script>

<style lang="less" scoped>
  .drag-wrapper {
    cursor: move;
    user-select: none;
  }
</style>
