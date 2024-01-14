const smLayout = [
  { type: 'NumberChart', x: 0, y: 0, w: 1, h: 1, i: '0' },
  { type: 'NumberChart', x: 0, y: 1, w: 1, h: 1, i: '1' },
  { type: 'NumberChart', x: 0, y: 2, w: 1, h: 1, i: '2' },
  { type: 'NumberChart', x: 0, y: 3, w: 1, h: 1, i: '3' },
  { type: 'BarEchart', x: 0, y: 4, w: 2, h: 2, i: '4' },
  { type: 'LineEchart', x: 0, y: 6, w: 2, h: 2, i: '5' },
  { type: 'BarDelayEchart', x: 0, y: 8, w: 4, h: 2, i: '6' }
]
const initGridLayout = {
  lg: [
    { type: 'NumberChart', x: 0, y: 0, w: 1, h: 1, i: '0' },
    { type: 'NumberChart', x: 1, y: 0, w: 1, h: 1, i: '1' },
    { type: 'NumberChart', x: 2, y: 0, w: 1, h: 1, i: '2' },
    { type: 'NumberChart', x: 3, y: 0, w: 1, h: 1, i: '3' },
    { type: 'BarEchart', x: 0, y: 1, w: 2, h: 2, i: '4' },
    { type: 'LineEchart', x: 2, y: 1, w: 2, h: 2, i: '5' },
    { type: 'BarDelayEchart', x: 0, y: 3, w: 4, h: 2, i: '6' }
  ],
  md: [
    { type: 'NumberChart', x: 0, y: 0, w: 1, h: 1, i: '0' },
    { type: 'NumberChart', x: 1, y: 0, w: 1, h: 1, i: '1' },
    { type: 'NumberChart', x: 0, y: 1, w: 1, h: 1, i: '2' },
    { type: 'NumberChart', x: 1, y: 1, w: 1, h: 1, i: '3' },
    { type: 'BarEchart', x: 0, y: 2, w: 2, h: 2, i: '4' },
    { type: 'LineEchart', x: 0, y: 4, w: 2, h: 2, i: '5' },
    { type: 'BarDelayEchart', x: 0, y: 6, w: 4, h: 2, i: '6' }
  ],
  sm: smLayout,
  xs: smLayout,
  xxs: smLayout
}

export default initGridLayout
