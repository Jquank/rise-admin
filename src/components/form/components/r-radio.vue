<template>
  <el-radio-group v-model="val">
    <el-radio
      v-for="item in props.optionData"
      :key="item.value"
      :label="item.value"
      >{{ item.label }}</el-radio
    >
  </el-radio-group>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  interface Option {
    label: string
    value: string | number
  }
  const props = defineProps({
    modelValue: {
      type: Object,
      default: () => ({})
    },
    optionData: {
      type: Array<Option>,
      default: () => []
    }
  })
  const emits = defineEmits(['update:modelValue'])

  const val = computed({
    get: () => props.modelValue?.value || null,
    set: (newVal) =>
      emits(
        'update:modelValue',
        props.optionData.find((item) => item.value === newVal) || null
      )
  })
</script>
