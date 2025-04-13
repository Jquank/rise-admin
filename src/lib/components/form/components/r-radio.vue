<template>
  <el-radio-group v-model="val">
    <el-radio
      v-for="item in props.optionData"
      :key="item[props.valueField]"
      :value="item[props.valueField]"
      >{{ item[props.textField] }}</el-radio
    >
    <template v-for="(_, slot) in $slots" v-slot:[slot] :key="slot">
      <slot :name="slot"></slot>
    </template>
  </el-radio-group>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { defaultTextField, defaultValueField } from '../const'

  const props = defineProps({
    modelValue: {
      type: Object,
      default: () => ({})
    },
    optionData: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: Array<Record<string, any>>,
      default: () => []
    },
    textField: {
      type: String,
      default: defaultTextField
    },
    valueField: {
      type: String,
      default: defaultValueField
    }
  })
  const emits = defineEmits(['update:modelValue'])

  const val = computed({
    get: () => props.modelValue?.[props.valueField] || null,
    set: (newVal) =>
      emits(
        'update:modelValue',
        props.optionData.find((item) => item[props.valueField] === newVal) || ''
      )
  })
</script>
