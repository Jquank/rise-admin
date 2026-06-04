/**
 * 文本溢出指令，自动添加tooltip
 * 单行文本：
 * <div v-ellipsis-tooltip class="ellipsis">111</div>
 * 多行文本
 * <div v-ellipsis-tooltip.multiline class="multiline-ellipsis">111</div>
 * 多行文本时，如果在意高度，外部的高度需设置合理值，h = 3*line-height，不然可能会不一致，并且可能会触发tooltip
 */

import {
  createApp,
  h,
  nextTick,
  reactive,
  type App,
  type DirectiveBinding
} from 'vue'
import { ElTooltip } from 'element-plus'
import type { Placement } from '@popperjs/core'
import { debounce } from 'lodash-es'

type EllipsisBindingValue =
  | string
  | {
      textContent?: string
      lines?: number
    }

type EllipsisTooltipElement = HTMLElement & {
  _ellipsisDebounceFn?: ReturnType<typeof debounce>
  _ellipsisResizeObserver?: ResizeObserver
  _ellipsisTooltipApp?: App<Element>
  _ellipsisTooltipContainer?: HTMLDivElement
  _ellipsisTooltipState?: {
    content: string
    placement: Placement
    disabled: boolean
  }
  _ellipsisUserTitle?: string | null
}

const validPlacements = new Set<Placement>([
  'top',
  'top-start',
  'top-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'left',
  'left-start',
  'left-end',
  'right',
  'right-start',
  'right-end'
])

/** 解析 tooltip 位置：非法值回退为 top */
const getPlacement = (binding: DirectiveBinding<EllipsisBindingValue>) => {
  const placement = binding.arg
  if (placement && validPlacements.has(placement as Placement)) {
    return placement as Placement
  }
  return 'top'
}

/** 获取文本内容：优先使用 binding.value，其次使用元素文本 */
const getTooltipText = (
  el: HTMLElement,
  binding: DirectiveBinding<EllipsisBindingValue>
) => {
  if (!binding.value) return el.textContent ?? ''
  if (typeof binding.value === 'string') return binding.value
  if (typeof binding.value === 'object') {
    return binding.value.textContent ?? el.textContent ?? ''
  }
  return el.textContent ?? ''
}

/** 获取多行省略的行数，默认 3 行 */
const getLines = (binding: DirectiveBinding<EllipsisBindingValue>) => {
  if (typeof binding.value === 'object' && binding.value?.lines) {
    return binding.value.lines
  }
  return 3
}

/** 根据模式计算是否溢出 */
const isOverflow = (
  el: HTMLElement,
  binding: DirectiveBinding<EllipsisBindingValue>
) => {
  if (binding.modifiers.multiline) {
    return el.scrollHeight > el.clientHeight
  }
  return el.scrollWidth > el.clientWidth
}

/** 同步省略样式和 tooltip 文本 */
const syncEllipsisTooltip = (
  rawEl: EllipsisTooltipElement,
  binding: DirectiveBinding<EllipsisBindingValue>
) => {
  const el = rawEl
  const lines = getLines(binding)
  const multilineClassPrefix = 'multiline-ellipsis-'

  if (binding.modifiers.multiline) {
    el.classList.add(`${multilineClassPrefix}${lines}`)
    el.classList.remove('ellipsis')
  } else {
    // 清除旧的多行 class，避免 lines 变化时残留
    for (const className of Array.from(el.classList)) {
      if (className.startsWith(multilineClassPrefix)) {
        el.classList.remove(className)
      }
    }
    el.classList.add('ellipsis')
  }

  // 同步 ElTooltip 的可见条件和内容
  if (el._ellipsisTooltipState) {
    el._ellipsisTooltipState.content = getTooltipText(el, binding)
    el._ellipsisTooltipState.placement = getPlacement(binding)
    el._ellipsisTooltipState.disabled = !isOverflow(el, binding)
  }
}

/** 创建 ElTooltip 子应用（使用 virtual-triggering，不替换原始 DOM） */
const createTooltipApp = (
  rawEl: EllipsisTooltipElement,
  binding: DirectiveBinding<EllipsisBindingValue>
) => {
  const el = rawEl
  if (el._ellipsisTooltipApp) return

  const state = reactive({
    content: getTooltipText(el, binding),
    placement: getPlacement(binding),
    disabled: true
  })

  const container = document.createElement('div')
  document.body.appendChild(container)

  const app = createApp({
    render() {
      return h(
        ElTooltip,
        {
          content: state.content,
          placement: state.placement,
          effect: 'dark',
          'popper-class': 'w-max-80',
          trigger: 'hover',
          disabled: state.disabled,
          virtualRef: el,
          virtualTriggering: true
        },
        {
          default: () => h('span')
        }
      )
    }
  })

  app.mount(container)
  el._ellipsisTooltipApp = app
  el._ellipsisTooltipContainer = container
  el._ellipsisTooltipState = state
}

/** 销毁 ElTooltip 子应用并回收挂载节点 */
const destroyTooltipApp = (rawEl: EllipsisTooltipElement) => {
  const el = rawEl
  if (el._ellipsisTooltipApp) {
    el._ellipsisTooltipApp.unmount()
    el._ellipsisTooltipApp = undefined
  }
  if (el._ellipsisTooltipContainer) {
    el._ellipsisTooltipContainer.remove()
    el._ellipsisTooltipContainer = undefined
  }
  el._ellipsisTooltipState = undefined
}

export const ellipsisTooltip = {
  mounted(
    rawEl: EllipsisTooltipElement,
    binding: DirectiveBinding<EllipsisBindingValue>
  ) {
    const el = rawEl
    // 记录并移除原始 title，避免与 ElTooltip 的 hover 提示冲突
    el._ellipsisUserTitle = el.getAttribute('title')
    el.removeAttribute('title')

    createTooltipApp(el, binding)

    const runSync = () => syncEllipsisTooltip(el, binding)
    el._ellipsisDebounceFn = debounce(runSync, 300)

    nextTick(runSync)
    window.addEventListener('resize', el._ellipsisDebounceFn)

    // 监听元素尺寸变化，兼容容器宽高变化导致的溢出状态变更
    if ('ResizeObserver' in window) {
      el._ellipsisResizeObserver = new ResizeObserver(() => {
        el._ellipsisDebounceFn?.()
      })
      el._ellipsisResizeObserver.observe(el)
    }
  },
  updated(
    rawEl: EllipsisTooltipElement,
    binding: DirectiveBinding<EllipsisBindingValue>
  ) {
    nextTick(() => {
      if (!rawEl._ellipsisTooltipApp) {
        createTooltipApp(rawEl, binding)
      }
      syncEllipsisTooltip(rawEl, binding)
    })
  },
  beforeUnmount(rawEl: EllipsisTooltipElement) {
    const el = rawEl
    if (el._ellipsisDebounceFn) {
      window.removeEventListener('resize', el._ellipsisDebounceFn)
      el._ellipsisDebounceFn.cancel()
      el._ellipsisDebounceFn = undefined
    }

    if (el._ellipsisResizeObserver) {
      el._ellipsisResizeObserver.disconnect()
      el._ellipsisResizeObserver = undefined
    }

    destroyTooltipApp(el)

    // 恢复业务原始 title，避免指令副作用泄露到组件外
    if (el._ellipsisUserTitle == null) {
      el.removeAttribute('title')
    } else {
      el.setAttribute('title', el._ellipsisUserTitle)
    }
    el._ellipsisUserTitle = undefined
  }
}
