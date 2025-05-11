<template>
  <div class="board-edit-wrapper">
    <!-- 左侧 -->
    <div
      class="board-left-wrapper"
      @drag="leftBubbleDrag"
      @dragend.capture="leftBubbleDragend">
      <slot name="left"></slot>
    </div>
    <!-- 中间拖拽区域 -->
    <div id="card-drag-content">
      <el-scrollbar class="drop-area-scrollbar" @dragover.prevent>
        <grid-layout
          ref="layoutRef"
          v-model:layout="layout"
          :col-num="4"
          :row-height="props.rowHeight"
          :is-resizable="true"
          :is-draggable="true"
          :vertical-compact="true"
          :use-css-transforms="true"
          :margin="[24, 24]">
          <grid-item
            v-for="item in layout"
            :ref="getItemRef"
            :key="item.i"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i"
            @resized="resized"
            v-show="item.i !== 'drop'">
            <div
              v-if="item.i && item.type && item.data"
              @click="chartClick(item)"
              :class="[
                'chart-wrapper',
                activeI === item.i ? 'chart-wrapper-acrive' : ''
              ]">
              <component
                :key="item.type"
                :is="getCurrentComponent(item.type)"
                :resizeKey="resizeKey"
                v-bind="item"></component>

              <el-popconfirm
                @confirm="deleteChart(item.i)"
                title="确定删除此卡片?"
                :width="200">
                <template #reference>
                  <SvgIcon
                    aria-hidden="false"
                    v-show="activeI === item.i"
                    class="chart-delete"
                    icon="delete"
                    :size="20"
                    color="red"></SvgIcon>
                </template>
              </el-popconfirm>
            </div>
          </grid-item>
        </grid-layout>
      </el-scrollbar>
      <div class="empty-card" v-show="showEmptyCard">
        <slot name="empty">
          <el-empty description="暂无数据" :image-size="200" />
        </slot>
      </div>
    </div>
    <!-- 右侧配置项 -->
    <div class="board-right-wrapper">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    ref,
    onMounted,
    computed,
    watch,
    onUnmounted,
    onBeforeUpdate,
    type ComponentPublicInstance,
    type Component
  } from 'vue'
  import NumberChart from './charts/number-chart.vue'
  import EchartComponent from './charts/echart-component.vue'
  import { ChartItemType, LayoutPosi, ChartType } from './type'
  import { SvgIcon } from '../svg-icon'
  import { useGlobalState } from './use-global-state'

  const props = withDefaults(
    defineProps<{
      modelValue: ChartItemType[]
      customCharts?: Record<string, Component>
      defaultSize?: [number, number]
      rowHeight?: number
    }>(),
    {
      modelValue: () => [],
      customCharts: () => ({}),
      defaultSize: () => [1, 1],
      rowHeight: 163
    }
  )
  const emits = defineEmits([
    'deleteSuccess',
    'add',
    'selected',
    'update:modelValue'
  ])
  /** 当前选中卡片的i */
  const activeI = ref('')
  /** 鼠标当前坐标 */
  let mouseXY: Pick<LayoutPosi, 'x' | 'y'> = { x: null, y: null }
  /** 存储当前拖拽卡片信息 */
  let DragPos: LayoutPosi = { x: null, y: null, w: 1, h: 1, i: null }
  /**全局状态*/
  const { globalState } = useGlobalState()
  /** 卡片容器尺寸 */
  let parentRect: DOMRect | null = null
  const layoutRef = ref(null)

  const itemRefs = ref<ComponentPublicInstance[]>([])
  const getItemRef = (el: ComponentPublicInstance) => {
    itemRefs.value.push(el)
  }

  const defaultW = computed(() => props.defaultSize[0])
  const defaultH = computed(() => props.defaultSize[1])
  /** 是否展示空状态 */
  const showEmptyCard = computed(() => layout.value.length === 0)

  const layout = ref<ChartItemType[]>([])

  watch(
    () => props.modelValue,
    (newVal) => {
      layout.value = newVal
    },
    { immediate: true }
  )

  onBeforeUpdate(() => {
    itemRefs.value = []
  })

  /** 监听被托元素的drag事件 */
  const leftBubbleDrag = (e: DragEvent) => {
    if (!(e.target as HTMLElement).dataset?.dragWrapper) return
    let mouseInGrid = false
    if (
      mouseXY.x > parentRect.left &&
      mouseXY.x < parentRect.right &&
      mouseXY.y > parentRect.top &&
      mouseXY.y < parentRect.bottom
    ) {
      mouseInGrid = true
    }
    if (
      mouseInGrid === true &&
      layout.value.findIndex((item) => item.i === 'drop') === -1
    ) {
      const len = layout.value.length
      layout.value.push({
        x: (len * 2) % 4,
        y: len + 4,
        w: defaultW.value,
        h: defaultH.value,
        i: 'drop'
      })
    }
    const index = layout.value.findIndex((item) => item.i === 'drop')
    if (index < 0) return
    const el = itemRefs.value[index] as unknown as {
      dragging: unknown
      calcXY: (arg1: number, arg2: number) => Pick<LayoutPosi, 'x' | 'y'>
    }
    if (!el) return
    el.dragging = {
      top: mouseXY.y - parentRect.top,
      left: mouseXY.x - parentRect.left
    }
    const new_pos = el.calcXY(
      mouseXY.y - parentRect.top,
      mouseXY.x - parentRect.left
    )
    if (mouseInGrid === true) {
      layoutRef.value.dragEvent(
        'dragstart',
        'drop',
        new_pos.x,
        new_pos.y,
        defaultH.value,
        defaultW.value
      )
      DragPos.i = String(index) + '-' + Date.now()
      DragPos.x = layout.value[index].x
      DragPos.y = layout.value[index].y
    }
  }

  /** 监听被托元素的dragend事件 */
  const leftBubbleDragend = (e: DragEvent) => {
    if (!(e.target as HTMLElement).dataset?.dragWrapper) return
    const index = layout.value.findIndex((item) => item.i === 'drop')
    if (index < 0) return
    layoutRef.value.dragEvent(
      'dragend',
      'drop',
      DragPos.x,
      DragPos.y,
      defaultH.value,
      defaultW.value
    )
    layout.value.splice(index, 1)
    layout.value.push({
      x: DragPos.x,
      y: DragPos.y,
      w: defaultW.value,
      h: defaultH.value,
      i: DragPos.i
    })
    layoutRef.value.dragEvent(
      'dragend',
      DragPos.i,
      DragPos.x,
      DragPos.y,
      defaultH.value,
      defaultW.value
    )
    activeI.value = DragPos.i
    emits('add', globalState.dataTransfer, DragPos.i)
  }

  /** 卡片触发resize时的标志 */
  const resizeKey = ref('')
  const resized = () => {
    layoutRef.value.layoutUpdate()
    resizeKey.value = new Date().getTime() + ''
  }

  /**卡片点击选中*/
  const chartClick = (item: ChartItemType) => {
    activeI.value = item.i
    emits('selected', item)
  }

  /** 删除当前选中图表 */
  const deleteChart = (i: string) => {
    if (!i) return
    const index = layout.value.findIndex((item) => item.i === i)
    if (index < 0) return
    const deleteItem = layout.value.splice(index, 1)
    if (deleteItem.length) {
      layoutRef.value.layoutUpdate()
      emits('deleteSuccess', deleteItem[0])
    }
  }

  let cacheComp = new Map()
  /** 获取渲染组件，支持自定义 */
  const getCurrentComponent = (type: string) => {
    if (cacheComp.get(type)) return cacheComp.get(type)
    if (!type) cacheComp.set(type, null)
    // 自定义组件
    if (String(+type) === 'NaN') cacheComp.set(type, props.customCharts[type])
    if (type === ChartType.NUMBER) {
      // 预设的数字图表
      cacheComp.set(type, NumberChart)
    } else {
      // 预设的echart图表统一使用EchartComponent组件渲染
      cacheComp.set(type, EchartComponent)
    }
    return cacheComp.get(type)
  }

  const documentDragoverCallback = (e: DragEvent) => {
    mouseXY.x = e.clientX
    mouseXY.y = e.clientY
  }
  onMounted(() => {
    parentRect = document
      .getElementById('card-drag-content')
      .getBoundingClientRect()

    document.addEventListener('dragover', documentDragoverCallback)
  })
  onUnmounted(() => {
    document.removeEventListener('dragover', documentDragoverCallback)
  })
</script>

<style lang="less" scoped>
  .board-edit-wrapper {
    display: flex;
    align-items: flex-start;
    height: 100%;
    overflow: hidden;
    position: relative;
    .drop-area-scrollbar {
      height: 100%;
    }
    #card-drag-content {
      flex: 1;
      width: 0;
      height: 100%;
      background-color: var(--section-bg-color);
      padding-bottom: 50px;
      .chart-wrapper {
        position: relative;
        height: 100%;
        padding: 15px;
        background-color: var(--main-bg-color);
        border: 1px solid transparent;
        border-radius: 2px;
        box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
        &:hover {
          box-shadow:
            0px 12px 32px 4px rgba(0, 0, 0, 0.04),
            0px 8px 20px rgba(0, 0, 0, 0.08);
        }
        .chart-delete {
          position: absolute;
          top: -10px;
          left: -10px;
          cursor: pointer;
          z-index: 10;
          &:focus {
            outline: none;
          }
        }
        // 子组件根元素样式
        .chart-inner {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          height: 100%;
          overflow: hidden;
        }
      }
      .chart-wrapper-acrive {
        border: 1px dashed var(--el-color-primary-light-3);
      }
    }
    .empty-card {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
</style>
