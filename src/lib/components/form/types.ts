/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Component } from 'vue'

export interface FormConfigItemType {
  label: string
  prop: string
  type?: string | Component
  customType?: Component | string
  required?: boolean
  rule?: unknown[]
  colNumber?: number
  itemConfig?: Record<string, any>
  compConfig?: Record<string, any>
}
