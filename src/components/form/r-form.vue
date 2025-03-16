<template>
  <el-form :model="props.model">
    <template v-for="item in props.config" :key="item.prop">
      <el-form-item v-bind="{ ...$attrs, ...item }">
        <component
          :is="item.type ? compMap[item.type] : item.customType"
          v-bind="item.compConfig || {}"
          v-model="formData[item.prop]"
          style="width: 100%">
        </component>
      </el-form-item>
    </template>
  </el-form>
</template>

<script setup lang="ts">
  import { ref, watchEffect } from 'vue'
  import { compMap } from './config'
  import { type ConfigItemType } from './type'
  // todo 表单校验，表单提交传参，表单只读模式
  const props = defineProps({
    config: {
      type: Array<ConfigItemType>,
      default: () => []
    },
    model: {
      type: Object,
      default: () => ({})
    }
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formData = ref<Record<string, any>>({})

  watchEffect(() => {
    formData.value = props.model
  })
</script>

<style lang="less" scoped></style>
