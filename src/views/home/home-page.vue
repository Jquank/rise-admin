<template>
  <div class="home-container">
    <ChartRender :data="CardData" />
  </div>
</template>

<script setup lang="ts">
  import { shallowRef } from 'vue'
  import { ChartRender } from '@/lib/components/drag-chart'
  import { boardApi } from '@/_api/index'

  const CardData = shallowRef([])
  const getBoardData = async () => {
    const { data: res } = await boardApi.getBoard()
    const { data } = await boardApi.getBoardById(res[0]?.id || '')
    CardData.value = data.cards || []
  }
  getBoardData()
</script>

<style lang="less" scoped>
  .home-container {
    width: 100%;
    padding: 0;
  }
</style>
