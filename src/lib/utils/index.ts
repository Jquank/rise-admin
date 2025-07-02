/** 高度过渡动画 */
export function transitionHeight(
  dom: HTMLElement,
  collapse: boolean,
  duration = 200
) {
  if (!dom) return
  const initHeight = dom.scrollHeight || 0
  let endHeight = 0
  let start: number | undefined
  let first = true
  // 缓动函数（jq）
  const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
    if ((t /= d / 2) < 1) return (c / 2) * t * t + b
    return (-c / 2) * (--t * (t - 2) - 1) + b
  }
  const step = function (timestamp: number) {
    if (first) {
      endHeight = dom.scrollHeight || 0
      first = false
    }

    if (!start) start = timestamp
    const time = timestamp - start
    let setHeight = easeInOutQuad(
      time,
      initHeight,
      endHeight - initHeight,
      duration
    )
    if (collapse ? endHeight - setHeight < 0 : endHeight - setHeight > 0) {
      setHeight = endHeight
    }
    dom.style.setProperty('height', setHeight + 'px')
    if (
      time < duration &&
      (collapse ? setHeight < endHeight : setHeight > endHeight)
    ) {
      window.requestAnimationFrame(step)
    } else {
      dom.style.setProperty('height', 'auto')
    }
  }
  window.requestAnimationFrame(step)
}
