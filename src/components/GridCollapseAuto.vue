<template>
  <div class="grid-collapse" ref="containerRef">
    <div
      ref="rowRef"
      class="grid-collapse-row"
      :class="{ collapsed: isCollapsed }"
      :style="{ gap: props.gap, '--item-min-width': resolvedItemMinWidth }">
      <!-- 第一行：只渲染能放下的项，按钮紧跟其后 -->
      <div
        v-for="(vnode, index) in firstLineItems"
        :key="`first-${index}`"
        class="grid-collapse-item">
        <component :is="vnode" />
      </div>
      <el-button
        v-if="showToggle"
        link
        type="primary"
        class="grid-collapse-toggle"
        @click="toggle">
        {{ isCollapsed ? props.expandText : props.collapseText }}
      </el-button>
      <!-- 展开时：剩余项渲染在按钮后面（自然换行到下一行） -->
      <template v-if="!isCollapsed">
        <div
          v-for="(vnode, index) in restItems"
          :key="`rest-${index}`"
          class="grid-collapse-item">
          <component :is="vnode" />
        </div>
      </template>
    </div>

    <!-- 隐藏测量行：用于计算每个 item 及按钮的宽度，不参与布局 -->
    <div
      ref="measureRowRef"
      class="grid-collapse-row measure"
      :style="{ gap: props.gap, '--item-min-width': resolvedItemMinWidth }">
      <div
        v-for="(vnode, index) in slotNodes"
        :key="`m-${index}`"
        ref="measureItemRefs"
        class="grid-collapse-item">
        <component :is="vnode" />
      </div>
      <el-button
        ref="toggleMeasureRef"
        link
        type="primary"
        class="grid-collapse-toggle">
        {{ isCollapsed ? props.expandText : props.collapseText }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    ref,
    computed,
    useSlots,
    onMounted,
    onBeforeUnmount,
    onBeforeUpdate,
    nextTick,
    watchEffect,
    h,
    Fragment,
    Text,
    Comment,
    type VNode,
    type ComponentPublicInstance
  } from 'vue'

  // 组件参数
  const props = defineProps({
    defaultCollapsed: {
      type: Boolean,
      default: true
    },
    gap: {
      type: String,
      default: '12px'
    },
    expandText: {
      type: String,
      default: '展开'
    },
    collapseText: {
      type: String,
      default: '收起'
    },
    itemMinWidth: {
      type: [String, Number],
      default: 'auto'
    }
  })

  const slots = useSlots()
  const isCollapsed = ref(props.defaultCollapsed)
  const firstLineCount = ref(0)
  const hasOverflow = ref(false)

  const containerRef = ref<HTMLElement | null>(null)
  const rowRef = ref<HTMLElement | null>(null)
  const measureRowRef = ref<HTMLElement | null>(null)
  const toggleMeasureRef = ref<HTMLElement | ComponentPublicInstance | null>(
    null
  )
  const measureItemRefs = ref<HTMLElement[]>([])

  // 规范化插槽：展开 Fragment，过滤注释，并把纯文本包进 span
  const normalizeNodes = (nodes: VNode[]) => {
    const result: VNode[] = []
    nodes.forEach((node) => {
      if (node.type === Comment) return
      if (node.type === Fragment && Array.isArray(node.children)) {
        result.push(...normalizeNodes(node.children as VNode[]))
        return
      }
      if (node.type === Text) {
        const text = String(node.children ?? '').trim()
        if (text) result.push(h('span', text))
        return
      }
      result.push(node)
    })
    return result
  }

  const slotNodes = computed(() => {
    const nodes = slots.default ? slots.default() : []
    return normalizeNodes(nodes as VNode[])
  })

  // 当溢出或处于展开态时显示按钮
  const showToggle = computed(() => hasOverflow.value || !isCollapsed.value)
  const firstLineItems = computed(() =>
    slotNodes.value.slice(0, firstLineCount.value)
  )
  const restItems = computed(() => slotNodes.value.slice(firstLineCount.value))

  // 最小宽度：可传 number | string | 'auto'
  const resolvedItemMinWidth = computed(() => {
    if (typeof props.itemMinWidth === 'number') {
      return `${props.itemMinWidth}px`
    }
    return props.itemMinWidth || 'auto'
  })

  // 获取实际 gap 像素值，用于计算可容纳的 item 数量
  const getGapPx = () => {
    if (!measureRowRef.value) return 0
    const styles = window.getComputedStyle(measureRowRef.value)
    const gapValue = styles.columnGap || styles.gap || '0'
    const gap = parseFloat(gapValue)
    return Number.isNaN(gap) ? 0 : gap
  }

  // element-plus 组件 ref 需要取 $el 才是 DOM
  const getDom = (
    el: HTMLElement | ComponentPublicInstance | null | undefined
  ): HTMLElement | null => {
    if (!el) return null
    if (el instanceof HTMLElement) return el
    const maybeEl = (el as ComponentPublicInstance).$el
    return maybeEl instanceof HTMLElement ? maybeEl : null
  }

  // 计算第一行能放下的 item 数量，并判断是否溢出
  const measure = () => {
    nextTick(() => {
      // 1) 容器可用宽度（以当前渲染宽度为准）
      const containerWidth = containerRef.value?.clientWidth || 0
      // 2) gap 的像素值（与 CSS gap 保持一致）
      const gap = getGapPx()
      // 3) 每个 item 的实际宽度（来自隐藏测量行）
      const widths = measureItemRefs.value.map(
        (el) => el?.getBoundingClientRect().width || 0
      )
      // 4) 按钮宽度（同样来自隐藏测量行）
      const toggleWidth =
        getDom(toggleMeasureRef.value)?.getBoundingClientRect().width || 0

      // 容器或测量数据不可用时，退化为全部展示
      if (!containerWidth || widths.length === 0) {
        const fallbackCount = slotNodes.value.length
        firstLineCount.value = fallbackCount
        hasOverflow.value = false
        return
      }

      // 使用测量行/可见行的 scrollWidth 判断是否有溢出
      const measureRowWidth = measureRowRef.value?.scrollWidth || 0
      const visibleRowWidth = rowRef.value?.scrollWidth || 0
      const rowWidth = Math.max(measureRowWidth, visibleRowWidth)
      hasOverflow.value = rowWidth > containerWidth

      // 不溢出：第一行就是全部
      if (!hasOverflow.value) {
        firstLineCount.value = widths.length
        return
      }

      // 溢出：从头累加，直到“已用宽度 + 按钮宽度”超过容器
      let used = 0
      let count = 0
      for (let i = 0; i < widths.length; i += 1) {
        const itemGap = count > 0 ? gap : 0
        const nextUsed = used + itemGap + widths[i]
        const toggleGap = nextUsed > 0 ? gap : 0
        // 需要为按钮预留空间，因此把按钮宽度也算进去
        if (nextUsed + toggleGap + toggleWidth <= containerWidth) {
          used = nextUsed
          count += 1
        } else {
          break
        }
      }

      // firstLineCount 用于：第一行 items + 按钮定位
      firstLineCount.value = count
    })
  }

  const toggle = () => {
    isCollapsed.value = !isCollapsed.value
    measure()
  }

  onBeforeUpdate(() => {
    measureItemRefs.value = []
  })

  // 监听容器尺寸变化，自动重算
  const resizeObserver = new ResizeObserver(() => measure())

  onMounted(() => {
    measure()
    if (containerRef.value) {
      resizeObserver.observe(containerRef.value)
    }
  })

  onBeforeUnmount(() => {
    resizeObserver.disconnect()
  })

  // 插槽变化时重算
  watchEffect(() => {
    slotNodes.value
    measure()
  })
</script>

<style lang="less" scoped>
  .grid-collapse {
    position: relative;
    width: 100%;
  }

  .grid-collapse-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
  }

  .grid-collapse-row.collapsed {
    flex-wrap: nowrap;
    overflow: hidden;
  }

  .grid-collapse-item {
    flex: 0 1 auto;
    min-width: var(--item-min-width, auto);
  }

  .grid-collapse-toggle {
    flex: 0 0 auto;
    white-space: nowrap;
  }

  .grid-collapse-row.measure {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    visibility: hidden;
    pointer-events: none;
    flex-wrap: nowrap;
    width: max-content;
  }
</style>
