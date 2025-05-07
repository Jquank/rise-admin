/* eslint-disable @typescript-eslint/no-explicit-any */

/** 预设的图表类型 */
export enum ChartType {
  BAR = '1',
  BARDELAY = '2',
  LINE = '3',
  PIE = '4',
  AREA = '5',
  GAUGE = '6',
  NUMBER = '50'
}

export interface LayoutPosi {
  x: number
  y: number
  w: number
  h: number
  i: string
}

export interface LayoutType extends LayoutPosi {
  [prop: string]: any
}

export interface DataType {
  legendData?: string[]
  xAxisData?: string[]
  yAxisData?: any[]
  [prop: string]: any
}

/** 图表的类型 */
export interface ChartItemType extends Partial<LayoutPosi> {
  id?: string | number
  type?: string
  posi?: string | LayoutPosi
  title?: string
  data?: DataType
  config?: Record<string, any>
  isFirst?: boolean
  [x: string]: any
}
