<template>
  <div class="home-container">
    <ChartRender :data="mockData.cards" />
  </div>
</template>

<script setup lang="ts">
  import { ChartRender } from '@/lib/components/drag-chart'
  import {
    numberDataMocked,
    barDataMocked,
    lineDataMocked
  } from '@/examples/board-list/mock'

  const mockData = {
    id: '1',
    title: '看板1',
    desc: '看板1描述',
    cards: [numberDataMocked, barDataMocked, lineDataMocked]
  }
</script>

<style lang="less" scoped>
  .home-container {
    width: 100%;
    padding: 0;
  }
</style>
