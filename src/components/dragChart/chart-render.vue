<template>
  <grid-layout
    v-model:layout="layout"
    :responsive-layouts="responsiveLyout"
    :col-num="4"
    :cols="{ lg: 4, md: 2, sm: 1, xs: 1, xxs: 1 }"
    :row-height="163"
    :is-draggable="true"
    :is-resizable="true"
    :vertical-compact="true"
    :use-css-transforms="true"
    :margin="[24, 24]"
    :responsive="true">
    <grid-item
      v-for="item in layout"
      :key="item.i"
      :x="item.x"
      :y="item.y"
      :w="item.w"
      :h="item.h"
      :i="item.i"
      @resized="resized">
      <div class="chart-wrapper">
        <component
          :is="getCurrentComponent(item.type)"
          :type="item.type"
          :i="item.i"
          :resizeI="resizeI"
          :gridItemResizeFlag="gridItemResizeFlag"></component>
      </div>
    </grid-item>
  </grid-layout>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import NumberChart from '@/components/charts/NumberChart.vue'
  import EchartComponent from '@/components/charts/EchartComponent.vue'
  import initGridLayout from './initGridLayout.ts'
  import { GraphType } from './type'

  const props = defineProps({
    /** 自定义组件，不要用数字作key，区分内置组件 */
    customGraphs: {
      type: Object,
      default: () => ({})
    }
  })

  const responsiveLyout = initGridLayout
  const layout = ref(initGridLayout.lg)
  const resizeI = ref('')
  const gridItemResizeFlag = ref('')

  // 调整大小后的事件
  const resized = (i: string) => {
    resizeI.value = i
    gridItemResizeFlag.value = new Date().getTime() + ''
  }

  const getCurrentComponent = (type: string) => {
    // 自定义组件
    if (String(+type) === 'NaN') return props.customGraphs[type]
    if (type === GraphType.NUMBER) {
      // 预设的数字图表
      return NumberChart
    } else {
      // 预设的echart图表统一使用EchartComponent组件渲染
      return EchartComponent
    }
  }
  onMounted(() => {
    // vue-grid-layout初始化响应式有bug，这里手动触发resize事件触发其内部的resize
    requestAnimationFrame(() => {
      window.dispatchEvent(new Event('resize'))
    })
  })
</script>

<style lang="less" scoped>
  .chart-wrapper {
    height: 100%;
    padding: 15px;
    background-color: var(--main-bg-color);
    border: 1px solid transparent;
    border-radius: 2px;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
    overflow: hidden;
    &:hover {
      box-shadow:
        0px 12px 32px 4px rgba(0, 0, 0, 0.04),
        0px 8px 20px rgba(0, 0, 0, 0.08);
    }
    // 子组件根元素样式
    .chart-inner {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      height: 100%;
    }
  }
</style>
