<template>
  <grid-layout
    :layout="layout"
    :col-num="4"
    :row-height="props.rowHeight"
    :isDraggable="false"
    :isResizable="false"
    :vertical-compact="true"
    :use-css-transforms="true"
    :margin="[24, 24]"
    :static="true">
    <grid-item
      v-for="item in layout"
      :key="item.i"
      :x="item.x"
      :y="item.y"
      :w="item.w"
      :h="item.h"
      :i="item.i"
      @resized="resized">
      <div class="chart-wrapper" v-if="item.i && item.type && item.data">
        <component
          :is="getCurrentComponent(item.type)"
          :type="item.type"
          :resizeKey="resizeKey"
          v-bind="item"></component>
      </div>
    </grid-item>
  </grid-layout>
</template>

<script setup lang="ts">
  import { ref, watchEffect, onMounted, PropType } from 'vue'
  import NumberChart from './charts/number-chart.vue'
  import EchartComponent from './charts/echart-component.vue'
  import { ChartItemType, ChartType } from './type'
  import { cloneDeep } from 'lodash-es'

  const props = defineProps({
    /** 自定义组件，不要用数字作key，区分内置组件 */
    customs: {
      type: Object,
      default: () => ({})
    },
    data: {
      type: Array as PropType<ChartItemType[]>,
      default: () => []
    },
    rowHeight: {
      type: Number,
      default: 163
    }
  })

  const layout = ref<ChartItemType[]>([])

  watchEffect(() => {
    let d = cloneDeep(props.data)
    d.forEach((item) => {
      if (!item.i && !item.x && item.posi) {
        if (typeof item.posi === 'string') {
          const posi = JSON.parse(item.posi)
          Object.assign(item, posi)
        }
        if (typeof item.posi === 'object') {
          Object.assign(item, item.posi)
        }
      }
    })
    layout.value = d
  })

  let cacheComp = new Map()
  /** 获取渲染组件，使用缓存，支持自定义 */
  const getCurrentComponent = (type: string) => {
    if (cacheComp.get(type)) return cacheComp.get(type)
    if (!type) cacheComp.set(type, null)
    // 自定义组件
    if (String(+type) === 'NaN') cacheComp.set(type, props.customs[type])
    if (type === ChartType.NUMBER) {
      // 预设的数字图表
      cacheComp.set(type, NumberChart)
    } else {
      // 预设的echart图表统一使用EchartComponent组件渲染
      cacheComp.set(type, EchartComponent)
    }
    return cacheComp.get(type)
  }

  /** 卡片触发resize时的标志 */
  const resizeKey = ref('')
  const resized = () => {
    resizeKey.value = new Date().getTime() + ''
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
