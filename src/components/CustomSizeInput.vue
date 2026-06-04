<template>
  <div class="custom-size-input">
    <el-input-number
      :model-value="width"
      @update:model-value="onWidthChange"
      :min="512"
      :max="2048"
      :step="64"
      controls-position="right"
      placeholder="宽" />
    <span class="times">×</span>
    <el-input-number
      :model-value="height"
      @update:model-value="onHeightChange"
      :min="512"
      :max="2048"
      :step="64"
      controls-position="right"
      placeholder="高" />
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'

  const props = defineProps<{
    modelValue: string
  }>()

  const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

  const parseSize = (val: string) => {
    const m = val?.match(/^(\d+)x(\d+)$/)
    return m ? ([Number(m[1]), Number(m[2])] as const) : ([null, null] as const)
  }

  const [w, h] = parseSize(props.modelValue)
  const width = ref<number | null>(w)
  const height = ref<number | null>(h)

  watch(
    () => props.modelValue,
    (val) => {
      const [pw, ph] = parseSize(val)
      width.value = pw
      height.value = ph
    }
  )

  function tryEmit() {
    if (width.value && height.value) {
      emit('update:modelValue', `${width.value}x${height.value}`)
    }
  }

  function onWidthChange(v: number | null | undefined) {
    width.value = v ?? null
    tryEmit()
  }
  function onHeightChange(v: number | null | undefined) {
    height.value = v ?? null
    tryEmit()
  }
</script>

<style lang="less" scoped>
  .custom-size-input {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    .times {
      flex-shrink: 0;
      color: var(--el-text-color-secondary);
      font-size: 16px;
    }
    :deep(.el-input-number) {
      flex: 1;
      min-width: 0;
    }
  }
</style>
