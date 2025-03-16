import { compMap } from './config'
import { type Component } from 'vue'
export type CompType = keyof typeof compMap
export interface ConfigItemType {
  label: string
  prop: string
  type?: CompType
  customType?: Component
  compConfig?: Record<string, unknown>
}
