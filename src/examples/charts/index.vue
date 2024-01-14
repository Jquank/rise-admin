<template>
  <EchartComponent :echartType="route.name" :key="route.name"></EchartComponent>
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import EchartComponent from '@/components/charts/EchartComponent.vue'
  import type { EchartType } from '@/components/charts/echartsOptions'
  const route = useRoute() as { name: EchartType }
</script>

<style lang="less" scoped>
  // 子组件根元素样式
  .chart-inner {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    height: 100%;
  }
</style>
