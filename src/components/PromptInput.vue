<template>
  <div class="prompt-input-wrap">
    <el-input
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      type="textarea"
      :rows="18"
      show-word-limit
      placeholder="输入画面描述（2048字符以内）"
      maxlength="2048" />
    <el-button
      class="ai-btn"
      size="small"
      plain
      type="primary"
      @click="handleAi"
      :loading="loading">
      {{ modelValue?.trim() ? 'AI 润色' : 'AI 生成' }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import { aiImageApi } from '@/_api'

  const props = defineProps<{ modelValue: string }>()
  const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
  const loading = ref(false)

  async function handleAi() {
    loading.value = true
    try {
      const { data } = await aiImageApi.refinePrompt(props.modelValue || '')
      if (data?.prompt) emit('update:modelValue', data.prompt)
    } catch {
      ElMessage.error('AI 处理失败')
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped>
  .prompt-input-wrap {
    position: relative;
    width: 100%;
  }
  .ai-btn {
    position: absolute;
    bottom: 4px;
    left: 14px;
  }
</style>
