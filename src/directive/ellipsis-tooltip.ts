/**
 * 文本溢出指令，自动添加tooltip
 * 单行文本：
 * <div v-ellipsis-tooltip class="ellipsis">111</div>
 * 多行文本
 * <div v-ellipsis-tooltip.multiline class="multiline-ellipsis">111</div>
 * 多行文本时，如果在意高度，外部的高度需设置合理值，h = 3*line-height，不然可能会不一致，并且可能会触发tooltip
 */

import { createApp, nextTick, h } from 'vue'
import { ElTooltip } from 'element-plus'
import { debounce } from 'lodash-es'
export const ellipsisTooltip = {
  mounted(el, binding) {
    /** 检测文本是否超出 */
    const checkEllipsis = () => {
      if (binding.modifiers.multiline) {
        return el.scrollHeight > el.offsetHeight
      }
      return el.scrollWidth > el.offsetWidth
    }

    /** 把el变为为ElTooltip包裹 */
    const showTooltip = () => {
      if (checkEllipsis()) {
        let lines = 3
        const textContext = (() => {
          if (!binding.value) return el.textContent
          if (typeof binding.value === 'string') return binding.value
          if (typeof binding.value === 'object') {
            lines = binding.value.lines || 3
            return binding.value?.textContent || el.textContent
          }
          return el.textContent
        })()
        const app = createApp({
          render() {
            return h(
              ElTooltip,
              {
                content: textContext,
                placement: binding.arg || 'top',
                effect: 'dark',
                'popper-class': 'w-max-80'
              },
              {
                default: () =>
                  h(
                    'div',
                    {
                      class: {
                        ['multiline-ellipsis-' + lines]:
                          binding.modifiers.multiline,
                        ellipsis: !binding.modifiers.multiline
                      }
                    },
                    el.textContent
                  )
              }
            )
          }
        })
        const container = document.createElement('div')
        app.mount(container)
        el.parentNode.replaceChild(container, el)
        el._tooltipApp = app
      }
    }
    nextTick(showTooltip)
    el._debounceFn = debounce(showTooltip, 300)
    window.addEventListener('resize', el._debounceFn)
  },
  updated(el) {
    nextTick(el._debounceFn)
  },
  beforeUnmount(el) {
    window.addEventListener('resize', el._debounceFn)
    if (el._tooltipApp) {
      el._tooltipApp.unmount()
    }
  }
}
