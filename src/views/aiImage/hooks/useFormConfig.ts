/**
 * useFormConfig — 根据模型能力生成表单配置
 *
 * 依赖 useAiApiParams 提供的能力信息，返回 RForm 的 config 数组。
 * 切换模型时表单字段的显示/隐藏由 `supports.*` 响应式控制。
 */
import { computed, type Ref, type ComputedRef } from 'vue'
import type {
  Res_AiImageModel,
  Res_AiImagePrompt
} from '@/_api/modules/aiImage'
import { type FormConfigItemType } from '@/lib/components/form'
import CustomSizeInput from '@/components/CustomSizeInput.vue'
import PromptInput from '@/components/PromptInput.vue'
import {
  COUNT_OPTIONS,
  NANO_BANANA_ASPECT_RATIOS,
  NANO_BANANA_IMAGE_SIZES,
  type ModelCapabilities
} from './useAiApiParams'

export interface FormConfigDeps {
  /** 模型列表 */
  models: Ref<Res_AiImageModel[]>
  /** 提示词模板列表 */
  prompts: Ref<Res_AiImagePrompt[]>
  /** 模型能力 */
  supports: ComputedRef<ModelCapabilities>
  /** 模型 label 生成器 */
  modelLabel: (m: Res_AiImageModel) => string
  /** 当前模型可选的尺寸 */
  sizeOptions: ComputedRef<{ label: string; value: string }[]>
  /** 回调 */
  onModelChange: () => void
  onPromptChange: () => void
}

export function useFormConfig(deps: FormConfigDeps) {
  const {
    models,
    prompts,
    supports,
    modelLabel,
    sizeOptions,
    onModelChange,
    onPromptChange
  } = deps

  const formConfig = computed<FormConfigItemType[]>(() => {
    const s = supports.value
    const allItems: FormConfigItemType[] = [
      // ---- 模型 ----
      {
        prop: 'modelId',
        label: '模型',
        type: 'select',
        required: true,
        colNumber: 1,
        compConfig: {
          customOptions: models.value.map((m) => ({
            label: modelLabel(m),
            value: m.id
          })),
          events: { change: onModelChange }
        }
      },
      // ---- 创意模板 ----
      {
        prop: 'promptId',
        label: '创意模板',
        type: 'select',
        colNumber: 1,
        compConfig: {
          clearable: true,
          customOptions: prompts.value.map((p) => ({
            label: p.name,
            value: p.id
          })),
          events: { change: onPromptChange }
        }
      },
      // ---- 创意（含 AI 润色按钮） ----
      {
        prop: 'prompt',
        label: '创意',
        required: true,
        customType: PromptInput,
        colNumber: 1,
        compConfig: {}
      },

      // ---- 尺寸（Nano Banana 显示比例 + 分辨率） ----
      ...(s.nanoSize
        ? [
            {
              prop: 'size',
              label: '比例',
              type: 'select' as const,
              required: true,
              colNumber: 1,
              compConfig: {
                customOptions: NANO_BANANA_ASPECT_RATIOS
              }
            } as FormConfigItemType,
            ...(s.imageSize
              ? [
                  {
                    prop: 'imageSizeVal',
                    label: '分辨率',
                    type: 'select' as const,
                    colNumber: 1,
                    compConfig: {
                      customOptions: NANO_BANANA_IMAGE_SIZES
                    }
                  } as FormConfigItemType
                ]
              : [])
          ]
        : [
            {
              prop: 'size',
              label: '尺寸',
              type: 'select' as const,
              required: true,
              colNumber: 1,
              compConfig: {
                clearable: false,
                filterable: true,
                customOptions: sizeOptions.value
              }
            } as FormConfigItemType
          ]),
      // ---- 自定义尺寸（仅 Z-Image 系列显示） ----
      ...(s.customSize
        ? [
            {
              prop: 'customSize',
              label: '自定义尺寸',
              customType: CustomSizeInput,
              colNumber: 1,
              compConfig: {}
            } as FormConfigItemType
          ]
        : []),
      // ---- 生成数量（GRSAI 隐藏） ----
      ...(s.multipleCount
        ? [
            {
              prop: 'n',
              label: '生成数量',
              type: 'select' as const,
              compConfig: {
                customOptions: COUNT_OPTIONS
              }
            } as FormConfigItemType
          ]
        : []),
      // ---- 水印（GRSAI 不支持，隐藏） ----
      ...(s.watermark
        ? [
            {
              prop: 'watermark',
              label: '水印',
              type: 'radio' as const,
              compConfig: {
                customOptions: [
                  { label: '关闭', value: false },
                  { label: '开启', value: true }
                ]
              }
            } as FormConfigItemType
          ]
        : [])
    ]

    return allItems
  })

  return { formConfig }
}
