const smLayout = [
  { type: '1', x: 0, y: 0, w: 1, h: 1, i: '0' },
  { type: '1', x: 0, y: 1, w: 1, h: 1, i: '1' },
  { type: '1', x: 0, y: 2, w: 1, h: 1, i: '2' },
  { type: '1', x: 0, y: 3, w: 1, h: 1, i: '3' },
  { type: '2', x: 0, y: 4, w: 2, h: 2, i: '4' },
  { type: '3', x: 0, y: 6, w: 2, h: 2, i: '5' },
  { type: '4', x: 0, y: 8, w: 4, h: 2, i: '6' }
]
const initGridLayout = {
  lg: [
    { type: '1', x: 0, y: 0, w: 1, h: 1, i: '0' },
    { type: '1', x: 1, y: 0, w: 1, h: 1, i: '1' },
    { type: '1', x: 2, y: 0, w: 1, h: 1, i: '2' },
    { type: '1', x: 3, y: 0, w: 1, h: 1, i: '3' },
    { type: '2', x: 0, y: 1, w: 2, h: 2, i: '4' },
    { type: '3', x: 2, y: 1, w: 2, h: 2, i: '5' },
    { type: '4', x: 0, y: 3, w: 4, h: 2, i: '6' }
  ],
  md: [
    { type: '1', x: 0, y: 0, w: 1, h: 1, i: '0' },
    { type: '1', x: 1, y: 0, w: 1, h: 1, i: '1' },
    { type: '1', x: 0, y: 1, w: 1, h: 1, i: '2' },
    { type: '1', x: 1, y: 1, w: 1, h: 1, i: '3' },
    { type: '2', x: 0, y: 2, w: 2, h: 2, i: '4' },
    { type: '3', x: 0, y: 4, w: 2, h: 2, i: '5' },
    { type: '4', x: 0, y: 6, w: 4, h: 2, i: '6' }
  ],
  sm: smLayout,
  xs: smLayout,
  xxs: smLayout
}

export default initGridLayout
