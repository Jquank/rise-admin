<template>
  <div class="number-title ellipsis">{{ props.title }}</div>
  <div class="number-value ellipsis">{{ props.value }}</div>
</template>

<script setup lang="ts">
  const props = defineProps({
    title: String,
    value: String
  })
</script>

<style lang="less" scoped>
  .number-title {
    cursor: default;
  }
  .number-value {
    font-size: 36px;
    font-weight: 500;
    cursor: default;
  }
</style>
