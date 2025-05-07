<template>
  <div class="chart-inner">
    <ChartTitle
      v-if="props.showTitle"
      v-bind="{ ...pick($attrs, ['title', 'value']) }" />
    <div ref="chartRef" class="inner-chart-box"></div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
  import ChartTitle from './chart-title.vue'
  import echarts from './base-echarts-settings'
  import { getBarOptions, getLineOptions } from './echarts-options'
  import { debounce, pick, cloneDeep } from 'lodash-es'
  import { ChartType, DataType } from '../type'

  interface SelfEvent extends Event {
    resizeEcharts: boolean
  }

  const props = withDefaults(
    defineProps<{
      data: DataType
      type: ChartType // echarts的类型
      showTitle?: boolean // 是否显示title
      resizeKey?: string
    }>(),
    {
      type: ChartType.BAR,
      showTitle: true,
      resizeKey: '',
      data: () => ({})
    }
  )

  const getOptionsFunc = (d) => {
    switch (props.type) {
      case ChartType.BAR:
        return getBarOptions(d)
      case ChartType.LINE:
        return getLineOptions(d)
      default:
        return getLineOptions(d)
    }
  }

  const chartRef = ref<HTMLElement | null>(null)
  let myChart: echarts.ECharts

  const resizeCallback = debounce((e: Event) => {
    let ev = e as SelfEvent
    if (ev.isTrusted || (!ev.isTrusted && ev.resizeEcharts)) {
      myChart.resize()
    }
  }, 50)

  // grid-item的resized事件后更新props.resizeKey，这里watch到变化后resize对应图表
  watch(
    () => props.resizeKey,
    () => {
      if (myChart) {
        nextTick(() => {
          myChart.resize()
        })
      }
    }
  )

  onMounted(() => {
    requestAnimationFrame(() => {
      myChart = echarts.init(chartRef.value)
      const options = getOptionsFunc(cloneDeep(props.data)).echartsOptions
      if (props.data && props.data.xAxisData) {
        myChart.setOption(options)
      }
    })

    window.addEventListener('resize', resizeCallback)
  })
  onUnmounted(() => {
    myChart?.dispose()
    window.removeEventListener('resize', resizeCallback)
  })
</script>

<style lang="less" scoped>
  .chart-inner :deep(.number-value) {
    font-size: 22px;
  }
  .inner-chart-box {
    flex: 1;
    height: 100%;
  }
</style>
