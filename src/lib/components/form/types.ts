import { compMap } from './config'
import { type Component } from 'vue'
export type CompType = keyof typeof compMap
export interface ConfigItemType {
  label: string
  prop: string
  type?: CompType
  customType?: Component
  required?: boolean
  rule?: unknown[]
  colNum?: number
  itemConfig?: Record<string, unknown>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  compConfig?: Record<string, any>
}
