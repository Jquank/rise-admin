<template>
  <el-select v-model="val" @clear="handleClear" :value-key="props.valueField">
    <el-option
      v-for="item in props.optionData"
      :key="item[props.valueField]"
      :value="
        Object.prototype.toString.call(props.modelValue) === '[object Object]'
          ? item
          : item.value
      "
      :label="item[props.textField]"></el-option>

    <template v-for="(_, slot) in $slots" #[slot] :key="slot">
      <slot :name="slot"></slot>
    </template>
  </el-select>
</template>

<script lang="ts" setup>
  import type { WritableComputedRef } from 'vue'
  import { defaultTextField, defaultValueField } from '../const'
  import { useVModel } from '@vueuse/core'

  const props = defineProps({
    modelValue: {
      type: [String, Number, Boolean, Object],
      default: null
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

  const emits = defineEmits(['update:modelValue', 'clear'])
  const val = useVModel(props, 'modelValue', emits) as WritableComputedRef<
    Record<string, unknown> | string | number | boolean
  >

  const handleClear = () => {
    val.value = ''
    emits('clear')
  }
</script>
