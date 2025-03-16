<template>
  <div
    class="home-container"
    id="card-drag-content"
    @drop="drop"
    @dragenter="dragenter"
    @dragover="dragover"
  >
    <grid-layout
      ref="layoutRef"
      v-model:layout="layout"
      :col-num="4"
      :row-height="163"
      :is-draggable="true"
      :is-resizable="true"
      :vertical-compact="true"
      :use-css-transforms="true"
      :margin="[24, 24]"
    >
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
      >
        <div
          @click="chartClick(item)"
          :class="[
            'chart-wrapper',
            activeI === item.i ? 'chart-wrapper-acrive' : ''
          ]"
        >
          <!-- <component
            v-once
            :is="getCurrentComponent(item.graphType)"
            :data="item"
            :echartType="item.graphType"
            :i="item.i"
            :resizeI="resizeI"
            :gridItemResizeFlag="gridItemResizeFlag"
          ></component> -->
          <component
            :is="getCurrentComponent(item)"
            :data="item"
            :echartType="item.graphType"
          ></component>
          <SvgIcon
            v-show="activeI === item.i"
            class="chart-delete"
            icon="levels"
            :size="20"
            color="red"
          ></SvgIcon>
        </div>
      </grid-item>
    </grid-layout>
  </div>
</template>

<script setup lang="ts">
  import {
    ref,
    onMounted,
    watch,
    PropType,
    VNodeChild,
    nextTick,
    ComponentPublicInstance
  } from 'vue'
  import NumberChart from '@/components/charts/NumberChart.vue'
  import EchartComponent from '@/components/charts/EchartComponent.vue'
  import initGridLayout from '@/views/home/initGridLayout'
  import { useGlobalState } from './useGlobalState'
  import {
    GraphItemType,
    GraphSizeEnum,
    LayoutType,
    DataTransferKeyType
  } from './type'
  import { cloneDeep, debounce } from 'lodash-es'
  import SvgIcon from '../SvgIcon.vue'
  const props = defineProps({
    modelValue: {
      type: Array as PropType<GraphItemType[]>,
      default: () => []
    }
  })
  const chartClick = (item: any) => {
    activeI.value = item.i
    emits('active', item)
  }
  const emits = defineEmits(['getNewData', 'delete', 'add', 'change', 'active'])
  const layoutRef = ref<any>(null)
  /** 当前看板的list */
  const layout = ref<LayoutType[]>([])
  /** 处于 active 状态的uuid */
  const activeUUID = ref('')
  const activeI = ref('')
  /** 是否render layout，暂时未用 */
  const isRenderGridLayout = ref(true)
  /** 鼠标当前坐标 */
  let mouseXY: any = { x: null, y: null }
  /** 存储当前拖拽卡片信息 */
  let DragPos: any = { x: null, y: null, w: 1, h: 1, i: null }
  /** 卡片是否在拖拽区域 */
  const mouseInGrid = ref(false)
  /** 卡片最新预定位置 */
  let new_pos: any = { x: 0, y: 0 }
  /** drop事件触发并且callback执行成功的标志 */
  let dropFlag = false
  /** 是否展示空状态 */
  const showEmptyIcon = ref(true)
  /** 拖拽容器的坐标信息 */
  let parentRect: DOMRect
  /** 回显触发watch的标志，只执行一次 */
  let immediateWatch = true

  const globalState = useGlobalState()

  /** w,h转换函数 */
  const formatWH = (type: keyof typeof GraphSizeEnum, wh: 'W' | 'H') => {
    let result = 1
    switch (type) {
      case GraphSizeEnum.MIDDLE:
        result = 2
        break
      case GraphSizeEnum.BIG:
        wh === 'W' ? (result = 4) : (result = 2)
        break
      default:
        break
    }
    return result
  }
  watch(
    () => props.modelValue,
    (val) => {
      if (!val || !val.length) {
        return
      }
      let data: any[] = cloneDeep(val)
      data.forEach((item, index) => {
        item.uuid = item.posi ? item.posi.i : index
        Object.assign(item, item.posi)
      })
      console.log(data, 'val')
      // 回显触发watch(id或isEdit)
      if (immediateWatch && data.length && (data[0].isEdit || data[0].id)) {
        console.log('1、回显触发watch')
        layout.value = data
        immediateWatch = false
      }
      // 拖拽触发watch
      if (data.length && dropFlag) {
        console.log('1、拖拽触发watch')
        layout.value = layout.value.concat(cloneDeep(data[data.length - 1]))
      }
      // 配置项变化触发watch
      if (!dropFlag) {
        console.log('1、配置项变化触发watch')
        let item = layout.value.find((item) => item.uuid === activeUUID.value)
        let index = layout.value.findIndex(
          (item) => item.uuid === activeUUID.value
        )
        if (item) {
          let w = formatWH(data[index].graphSize!, 'W')
          let h = formatWH(data[index].graphSize!, 'H')
          let x = item.x
          let y = item.y
          // 处理大小变化的右侧边界情况
          if (w + x > 4) {
            x = x - (w + x - 4)
          }
          Object.assign(item, data[index], { w, h, x, y })
          layoutRef.value.layoutUpdate()
        }
      }
    },
    { immediate: true, deep: true }
  )

  /** 使用新的事件更新父组件数据 */
  watch(
    () => layout.value,
    debounce((val) => {
      let data = cloneDeep(val)
      // 更新posi中的数据为最新
      data.forEach((item: LayoutType) => {
        item.posi = item.posi || {}
        item.posi.x = item.x
        item.posi.y = item.y
        item.posi.w = item.w
        item.posi.h = item.h
        item.posi.i = item.i
      })
      emits('getNewData', data)
    }, 200),
    { deep: true }
  )

  /** 选中图标切换的操作 */
  const graphActiveChange = (uuid: string) => {
    const activeIndex = layout.value.findIndex((v) => v.uuid === uuid)
    if (activeIndex > -1) {
      emits('change', activeIndex, cloneDeep(layout.value[activeIndex]))
    }
  }
  /** 选中图标删除的操作 */
  const graphDeleteChange = (uuid: string) => {
    const activeIndex = layout.value.findIndex((v) => v.uuid === uuid)
    if (activeIndex > -1) {
      let fn = () => {
        layout.value.splice(activeIndex, 1)
        layoutRef.value.layoutUpdate()
      }
      emits('delete', fn)
    }
  }

  interface SelfChartListType {
    [props: string]: unknown
  }

  //   const responsiveLyout = initGridLayout
  const responsiveLyout: LayoutType[] = []
  const resizeI = ref('')
  const gridItemResizeFlag = ref('')

  const itemRefs = ref<ComponentPublicInstance[]>([])
  const getItemRef = (el: ComponentPublicInstance) => {
    itemRefs.value.push(el)
  }

  // 调整大小后的事件
  const resized = (i: string) => {
    resizeI.value = i
    gridItemResizeFlag.value = new Date().getTime() + ''
  }

  /** 自定义chart，命名规则：XxxxChart，区分echarts组件 */
  const selfChartList: SelfChartListType = {
    NumberChart
  }

  const getCurrentComponent = (item: any) => {
    if (!item.graphType) {
      return
    }
    // echart图表统一使用EchartComponent组件渲染
    // if (type != 0) return EchartComponent
    // return selfChartList[type]
    return NumberChart
  }
  const dragenter = (e: DragEvent) => {
    showEmptyIcon.value = false
  }
  const dragover = (e: DragEvent) => {
    e.preventDefault()
    e.dataTransfer!.dropEffect = 'move'
    itemRefs.value = []
    let len = layout.value.length
    if (
      mouseInGrid.value === true &&
      layout.value.findIndex((item) => item.i === 'drop') === -1
    ) {
      layout.value.push({
        x: (len * 2) % 4,
        y: len + 4,
        w: 1,
        h: 1,
        i: 'drop'
      })
    }
    let index = layout.value.findIndex((item) => item.i === 'drop')
    if (index !== -1) {
      nextTick(() => {
        try {
          itemRefs.value[layout.value.length - 1].$refs.item.style.display =
            'none'
        } catch (error) {
          /* empty */
        }

        let el = itemRefs.value[index]
        el.dragging = {
          top: mouseXY.y - parentRect.top,
          left: mouseXY.x - parentRect.left
        }
        new_pos = el.calcXY(
          mouseXY.y - parentRect.top,
          mouseXY.x - parentRect.left
        )
        // console.log(new_pos, 'new_pos')
        if (mouseInGrid.value === true) {
          layoutRef.value.dragEvent(
            'dragstart',
            'drop',
            new_pos.x,
            new_pos.y,
            1,
            1
          )
          DragPos.i = String(index)
          DragPos.x = layout.value[index].x
          DragPos.y = layout.value[index].y
          // console.log(DragPos)
        }
        itemRefs.value = []
      })
    }
  }
  /** 生成UUID */
  const createUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      }
    )
  }
  const dropCallback = (data: any) => {
    if (mouseInGrid.value === true) {
      let newI = createUUID()
      // 异步callback
      let fn = () => {
        dropFlag = true
        layoutRef.value!.dragEvent(
          'dragend',
          'drop',
          DragPos.x,
          DragPos.y,
          1,
          1
        )
        layout.value = layout.value.filter((item) => item.i !== 'drop')
        nextTick(() => {
          layoutRef.value!.dragEvent(
            'dragend',
            newI,
            DragPos.x,
            DragPos.y,
            1,
            1
          )
          try {
            itemRefs.value[layout.value.length].$refs.item.style.display =
              'block'
          } catch {
            /* empty */
          }
          dropFlag = false
        })
      }
      // 派发add事件，业务更新layout（modelValue）
      emits(
        'add',
        data,
        {
          index: layout.value.length,
          posi: { ...DragPos, i: newI }
        },
        fn
      )
    }
  }
  watch(
    () => globalState.isHandleDropCallback.value,
    (val) => {
      if (val === true) {
        console.log('手动触发drop回调')
        dropCallback(globalState.dataTransfer.value)
      }
    }
  )
  const drop = (e: DragEvent) => {
    console.log('触发drop事件')
    // 是否触发drop回调的标志
    globalState.isDropFlag.value = true
    e.preventDefault()
    e.stopPropagation()
    // let data = JSON.parse(
    //   e.dataTransfer!.getData(DataTransferKeyType.key) || '{}'
    // )
    let data = globalState.dataTransfer.value
    // 拖拽元素需来自cloneCardBase组件
    if (data._mark !== DataTransferKeyType.key) {
      return
    }
    dropCallback(data)
  }
  onMounted(() => {
    // vue-grid-layout初始化响应式有bug，这里手动触发resize事件触发其内部的resize
    requestAnimationFrame(() => {
      window.dispatchEvent(new Event('resize'))
    })

    nextTick(() => {
      parentRect = document
        .getElementById('card-drag-content')!
        .getBoundingClientRect()
    })
    document.addEventListener(
      'dragover',
      function (e) {
        mouseXY.x = e.clientX
        mouseXY.y = e.clientY
        if (
          mouseXY.x > parentRect.left &&
          mouseXY.x < parentRect.right &&
          mouseXY.y > parentRect.top &&
          mouseXY.y < parentRect.bottom
        ) {
          mouseInGrid.value = true
        } else {
          mouseInGrid.value = false
        }
        if (mouseInGrid.value === false) {
          try {
            layoutRef.value.dragEvent(
              'dragend',
              'drop',
              new_pos.x,
              new_pos.y,
              1,
              1
            )
          } catch (error) {
            /* empty */
          }

          layout.value = layout.value.filter((item) => item.i !== 'drop')
        }
      },
      false
    )
  })
</script>

<style lang="less" scoped>
  .home-container {
    width: 100%;
    min-height: 100%;
    padding: 0;
    .chart-wrapper {
      position: relative;
      height: 100%;
      padding: 15px;
      background-color: var(--main-bg-color);
      border: 1px solid transparent;
      border-radius: 2px;
      box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
      // overflow: hidden;
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
    .chart-wrapper-acrive {
      border: 1px dashed var(--el-color-primary-light-3);
    }
  }
</style>
