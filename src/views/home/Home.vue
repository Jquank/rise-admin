<template>
  <div class="home-container">
    <ChartRender :data="CardData" />
  </div>
</template>

<script setup lang="ts">
  import { shallowRef } from 'vue'
  import { ChartRender } from '@/lib/components/drag-chart'
  import { BoardApi } from '@/_api2/index'

  const CardData = shallowRef([])
  BoardApi.getBoardById(1).then((res: any) => {
    CardData.value = res.data.cards || []
  })
</script>

<style lang="less" scoped>
  .home-container {
    width: 100%;
    padding: 0;
  }
</style>
