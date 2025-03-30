<template>
  <el-select v-model="val">
    <el-option
      v-for="item in props.optionData"
      :key="item.value"
      :value="item"
      :label="item.label"
      value-key="value"></el-option>

    <template v-for="item in slotsArr" #[item.key] :key="item.key">
      <!-- <component
        v-for="(s, index) in item.slot"
        :is="s"
        :key="index"></component> -->
      <slot :name="item.key"></slot>
    </template>
  </el-select>
</template>

<script lang="ts" setup>
  import { ref, watchEffect, useSlots, computed } from 'vue'
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
  const val = ref({})
  watchEffect(() => {
    val.value = props.modelValue
  })

  const slots = useSlots()
  const slotsArr = computed(() => {
    return Object.keys(slots).map((key) => {
      return { key, slot: slots[key] ? slots[key]() : null }
    })
  })
</script>
