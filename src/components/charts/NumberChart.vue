<template>
  <div class="chart-inner">
    <ChartTitle v-bind="{ ...pick($attrs, ['title', 'value']) }" />
    <div class="number-footer">
      <span>
        <SvgIcon icon="shangjiantou" color="rgb(82, 196, 26)" />
        {{ 11 }}</span
      >
      <span class="last-span">
        <SvgIcon icon="xiajiantou" color="rgb(250, 84, 28)" />
        {{ 22 }}</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
  import ChartTitle from './ChartTitle.vue'
  import { pick } from 'lodash-es'
</script>

<style lang="less" scoped>
  :deep(.number-value) {
    margin-top: -20px;
  }
  .number-footer {
    align-self: flex-end;
    cursor: default;
    .last-span {
      margin-left: 15px;
    }
  }
</style>
