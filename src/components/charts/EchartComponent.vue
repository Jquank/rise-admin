<template>
  <div class="chart-inner">
    <ChartTitle
      v-if="props.showTitle"
      :title="data.title"
      :value="data.value" />
    <div ref="chartRef" class="inner-chart-box"></div>
  </div>
</template>

<script setup lang="ts">
  import {
    ref,
    reactive,
    onMounted,
    onUnmounted,
    computed,
    watch,
    nextTick
  } from 'vue'
  import ChartTitle from './ChartTitle.vue'
  import echarts from './baseEchartsSettings'
  import {
    getBarOptions,
    getBarDelayOptions,
    getLineOptions
  } from './echartsOptions'
  import { debounce } from 'lodash-es'
  import { GraphType } from '../dragChart/type'

  interface SelfEvent extends Event {
    resizeEcharts: boolean
  }

  const props = withDefaults(
    defineProps<{
      type?: GraphType // echarts的类型
      showTitle?: boolean // 是否显示title
      i?: string // 当前卡片的i
      resizeI?: string // 当前改变大小的grid-item的i
      gridItemResizeFlag?: string // grid-item的resized事件触发标志
    }>(),
    {
      type: GraphType.BAR,
      showTitle: true,
      i: '',
      resizeI: '',
      gridItemResizeFlag: ''
    }
  )

  const getOptionsFunc = computed(() => {
    switch (props.type) {
      case GraphType.BAR:
        return getBarOptions
      case GraphType.BARDELAY:
        return getBarDelayOptions
      case GraphType.LINE:
        return getLineOptions
      default:
        return getBarOptions
    }
  })

  const chartRef = ref<HTMLElement | null>(null)
  let myChart: echarts.ECharts
  const data = reactive(getOptionsFunc.value().baseData)

  // resizeCallback，重置echarts
  const resizeCallback = debounce((e: Event) => {
    let ev = e as SelfEvent
    if (ev.isTrusted || (!ev.isTrusted && ev.resizeEcharts)) {
      myChart.resize()
    }
  }, 100)

  // grid-item的resized事件后更新props.gridItemResizeFlag，这里watch到变化后resize对应图表
  watch(
    () => props.gridItemResizeFlag,
    () => {
      if (props.resizeI === props.i && myChart) {
        nextTick(() => {
          myChart.resize()
        })
      }
    }
  )
  onMounted(() => {
    requestAnimationFrame(() => {
      myChart = echarts.init(chartRef.value)
      myChart.setOption(getOptionsFunc.value().echartsOptions)
    })
    window.addEventListener('resize', resizeCallback)
  })
  onUnmounted(() => {
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
