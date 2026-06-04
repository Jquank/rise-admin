/**
 * useAiApiParams — 模型能力 & 参数配置
 *
 * 集中管理各模型的差异化参数，新增模型只需在这里追加配置即可，
 * 表单和页面逻辑通过 `supports` 响应式驱动。
 * 定价从后端模型数据 `price` 字段读取，不再前端写死。
 */
import { computed, type Ref } from 'vue'
import type { Res_AiImageModel } from '@/_api/modules/aiImage'

// ========== 静态常量 ==========

/** 通用尺寸选项 */
const BASE_SIZE_OPTIONS = [
  { label: '1024x1024 （1:1 正方形）', value: '1024x1024' },
  { label: '1536x1024 （3:2 横版）', value: '1536x1024' },
  { label: '1024x1536 （2:3 竖版）', value: '1024x1536' },
  { label: '1536x1152 （4:3 横版）', value: '1536x1152' },
  { label: '1152x1536 （3:4 竖版）', value: '1152x1536' },
  { label: '1920x1080 （16:9 宽屏）', value: '1920x1080' },
  { label: '1080x1920 （9:16 竖屏）', value: '1080x1920' }
]

/** ERNIE 专用尺寸（仅 7 种固定分辨率） */
const ERNIE_SIZE_OPTIONS = [
  { label: '1376x768 （≈16:9 横版）', value: '1376x768' },
  { label: '1024x1024 （1:1 正方形）', value: '1024x1024' },
  { label: '768x1376 （≈9:16 竖版）', value: '768x1376' },
  { label: '848x1264 （≈2:3）', value: '848x1264' },
  { label: '896x1200 （≈3:4）', value: '896x1200' },
  { label: '1264x848 （≈3:2）', value: '1264x848' },
  { label: '1200x896 （≈4:3）', value: '1200x896' }
]

/** 按模型名映射尺寸选项（未配置的模型走 __default） */
const SIZE_OPTIONS_MAP: Record<string, { label: string; value: string }[]> = {
  'ernie-image-turbo': ERNIE_SIZE_OPTIONS,
  __default: BASE_SIZE_OPTIONS
}

/** 生成数量选项 */
export const COUNT_OPTIONS = [
  { label: '1 张', value: 1 },
  { label: '2 张', value: 2 },
  { label: '3 张', value: 3 },
  { label: '4 张', value: 4 }
]

// ========== 能力描述 ==========

export interface ModelCapabilities {
  /** 支持自定义尺寸输入（非下拉预设） */
  customSize: boolean
  /** 支持一次生成多张 */
  multipleCount: boolean
  /** 支持水印开关 */
  watermark: boolean
  /** 支持参考图编辑 */
  refImages: boolean
  /** Nano Banana 比例选择器（aspectRatio: auto/1:1/16:9…） */
  nanoSize: boolean
  /** 支持分辨率等级选择（1K/2K/4K），如 Nano Banana 2 */
  imageSize: boolean
}

/** Nano Banana 比例选项（aspectRatio） */
export const NANO_BANANA_ASPECT_RATIOS = [
  { label: 'auto（自动）', value: 'auto' },
  { label: '1:1（正方形）', value: '1:1' },
  { label: '16:9（宽屏）', value: '16:9' },
  { label: '9:16（竖屏）', value: '9:16' },
  { label: '4:3（横版）', value: '4:3' },
  { label: '3:4（竖版）', value: '3:4' },
  { label: '3:2（横版）', value: '3:2' },
  { label: '2:3（竖版）', value: '2:3' },
  { label: '5:4（横版）', value: '5:4' },
  { label: '4:5（竖版）', value: '4:5' },
  { label: '21:9（超宽）', value: '21:9' }
]

/** Nano Banana 分辨率等级（仅 nano-banana-2 支持） */
export const NANO_BANANA_IMAGE_SIZES = [
  { label: '1K（标清）', value: '1K' },
  { label: '2K（高清）', value: '2K' },
  { label: '4K（超清）', value: '4K' }
]

/** 各模型的能力开关（只开启该模型支持的能力，未列出的走 DEFAULT_CAPABILITIES） */
const CAPABILITIES_MAP: Record<string, Partial<ModelCapabilities>> = {
  'z-image-turbo': { customSize: true },
  'z-image': { customSize: true },
  'grsai-gpt-image-2': {
    watermark: false,
    refImages: true
  },
  'nano-banana-fast': {
    watermark: false,
    refImages: true,
    nanoSize: true
  },
  'nano-banana-2': {
    watermark: false,
    refImages: true,
    nanoSize: true,
    imageSize: true
  }
}

const DEFAULT_CAPABILITIES: ModelCapabilities = {
  customSize: false,
  multipleCount: false,
  watermark: true,
  refImages: false,
  nanoSize: false,
  imageSize: false
}

// ========== Composable ==========

export function useAiApiParams(
  models: Ref<Res_AiImageModel[]>,
  selectedModelId: Ref<number | null>
) {
  /** 当前模型全量信息 */
  const currentModel = computed<Res_AiImageModel | undefined>(() =>
    models.value.find((m) => m.id === selectedModelId.value)
  )

  /** 模型标识名 */
  const modelName = computed(() => currentModel.value?.name ?? '')

  /** 模型能力 */
  const supports = computed<ModelCapabilities>(() => ({
    ...DEFAULT_CAPABILITIES,
    ...(CAPABILITIES_MAP[modelName.value] || {})
  }))

  /** 单价（元） */
  const priceYuan = computed(() => (currentModel.value?.price ?? 0) / 100)

  /** 模型下拉选项的 label（含定价） */
  const modelLabel = (m: Res_AiImageModel) =>
    `${m.displayName}（¥${((m.price || 0) / 100).toFixed(2)}/张）`

  /** 当前模型可选的尺寸列表 */
  const sizeOptions = computed(
    () => SIZE_OPTIONS_MAP[modelName.value] || SIZE_OPTIONS_MAP.__default
  )

  /** 估算消耗（元/次），接收当前数量 */
  function estimatedCost(count: number) {
    return (priceYuan.value * count).toFixed(2)
  }

  return {
    modelName,
    currentModel,
    supports,
    priceYuan,
    modelLabel,
    sizeOptions,
    estimatedCost
  }
}
