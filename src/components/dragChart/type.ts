/* eslint-disable @typescript-eslint/no-explicit-any */

/** 图表类型定义 */
export enum GraphKeyEnum {
  'LINE' = 'LINE',
  'BAR' = 'BAR',
  'NUMBER' = 'NUMBER',
  'TABLE' = 'TABLE',
  'AREA' = 'AREA',
  'PIE' = 'PIE',
  'GAUGE' = 'GAUGE',
  'TEXT' = 'TEXT',
  'COMPUTED' = 'COMPUTED'
}
export type GraphKeyType = keyof typeof GraphKeyEnum

/** 图表尺寸定义 */
export enum GraphSizeEnum {
  'SMALL' = 'SMALL',
  'MIDDLE' = 'MIDDLE',
  'BIG' = 'BIG'
}
export type GraphSizeType = keyof typeof GraphSizeEnum
/** 图表每一项的类型 */
export type GraphItemType = {
  [x: string]: any
  uuid?: string
  graphSize?: GraphSizeType
  graphType?: GraphKeyType
  isFirst?: boolean
  graphs?: GraphItemType[]
}

interface LineChartChildrenType {
  name: string
  data: string[] | number[]
}
interface LineChartSeriesType {
  id: number | string
  name: string
  data?: string[] | number[]
  type?: string
  children?: LineChartChildrenType[]
}
/** 折线图数据类型 */
export interface LineChartDataType {
  xAxis: string[] | number[]
  series: LineChartSeriesType[]
  legendList?: any[]
}
export interface LayoutType {
  x: number
  y: number
  w: number
  h: number
  i: string
  [prop: string]: any
}

export enum DataTransferKeyType {
  key = 'from-drap-wrapper'
}
