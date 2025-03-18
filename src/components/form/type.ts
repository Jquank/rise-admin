import { compMap } from './config'
import { type Component } from 'vue'
export type CompType = keyof typeof compMap
export interface ConfigItemType {
  label: string
  prop: string
  type?: CompType
  customType?: Component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  compConfig?: Record<string, any>
}
