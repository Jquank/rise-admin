<template>
  <div class="r-form-box" ref="gridCollapseRef">
    <el-form
      ref="formRef"
      :model="formData"
      v-bind="{
        labelWidth: 'auto',
        validateOnRuleChange: false,
        ...$attrs,
        ...{ rules }
      }">
      <el-row :gutter="20" class="slot-el-row">
        <el-col
          v-for="(item, index) in props.config"
          :key="item.prop"
          ref="colRefs"
          :xs="getColSpan(item, 'xs')"
          :sm="getColSpan(item, 'sm')"
          :md="getColSpan(item, 'md')"
          :lg="getColSpan(item, 'lg')"
          :xl="getColSpan(item, 'xl')"
          :class="{
            'hidden-xs-only xs': hiddenCol(index, 'xs'),
            'hidden-sm-only sm': hiddenCol(index, 'sm'),
            'hidden-md-only md': hiddenCol(index, 'md'),
            'hidden-lg-only lg': hiddenCol(index, 'lg'),
            'hidden-xl-only xl': hiddenCol(index, 'xl')
          }">
          <el-form-item
            v-bind="{
              ...item?.itemConfig,
              prop: item.prop,
              label: item.label
            }">
            <template #label="{ label }">
              <el-tooltip
                :visible="labelTooltipVisibleArr[index].visible"
                effect="dark"
                placement="top-start">
                <template #content>
                  {{ label }}
                </template>
                <span
                  class="custom-form-item-label"
                  @mouseenter="labelMouseEneter($event, index)"
                  @mouseleave="labelMouseLeave(index)"
                  >{{ label }}</span
                >
              </el-tooltip>
              <span v-if="props.labelSuffix">{{ props.labelSuffix }}</span>
            </template>
            <!-- 处理el-form-item插槽，支持text,html,组件 -->
            <template
              v-for="slot in item?.itemConfig?.slots || []"
              :key="slot.name"
              v-slot:[slot.name]>
              <div
                v-if="slot.content?.type === 'text'"
                v-text="slot.content.value"></div>
              <div
                v-else-if="slot.content?.type === 'html'"
                v-html="slot.content.value"></div>
              <component
                v-else
                :is="slot.content?.type"
                v-bind="slot.content.value || {}"></component>
            </template>
            <!-- readonly 渲染文本 -->
            <span v-if="props.readonly" class="readonly-item-text">
              {{ getLabel(item) }}
            </span>
            <!-- 渲染表单组件 -->
            <component
              v-else
              :is="getFormComp(item)"
              v-bind="{
                clearable: true,
                optionData: options[index],
                ...item.compConfig,
                ...transformEventName(item?.compConfig?.events)
              }"
              v-model="formData[item.prop]"
              @focus="compFocus(item, index)"
              style="width: 100%">
              <!-- 处理组件插槽，支持text,html,组件 -->
              <template
                v-for="slot in item.compConfig?.slots || []"
                :key="slot.name"
                v-slot:[slot.name]>
                <div
                  v-if="slot.content?.type === 'text'"
                  v-text="slot.content.value"></div>
                <div
                  v-else-if="slot.content?.type === 'html'"
                  v-html="slot.content.value"></div>
                <component
                  v-else
                  :is="slot.content?.type"
                  v-bind="slot.content.value || {}"></component>
              </template>
            </component>
          </el-form-item>
        </el-col>
        <el-col
          v-if="props.showLastCol"
          :xs="originBreakPoint.xs"
          :sm="originBreakPoint.sm"
          :md="originBreakPoint.md"
          :lg="originBreakPoint.lg"
          :xl="originBreakPoint.xl"
          ref="lastColRef"
          class="expand-or-collapse">
          <div class="button-col">
            <div class="left">
              <slot name="left-buttons" v-if="props.buttonInRow"></slot>
            </div>
            <div class="right">
              <slot name="right-buttons"></slot>
              <el-button
                @click="search"
                type="primary"
                :native-type="props.submitButton ? 'submit' : 'button'"
                v-if="showActionBtn"
                :loading="props.loading"
                >查询</el-button
              >
              <el-button @click="reset" v-if="showActionBtn">重置</el-button>
              <span @click="toggleCollapse" class="text">{{
                defaultCollapseState
                  ? $t('common.expand')
                  : $t('common.collapse')
              }}</span>
              <SvgIcon
                @click="toggleCollapse"
                :icon="
                  defaultCollapseState ? 'arrow-down' : 'arrow-up'
                "></SvgIcon>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
  import {
    ref,
    watchEffect,
    PropType,
    reactive,
    ComponentPublicInstance,
    onMounted,
    computed
  } from 'vue'
  import { compMap } from './config'
  import { defaultTextField } from './const'
  import { type FormConfigItemType } from './types'
  import {
    isNil,
    isString,
    isNumber,
    isArray,
    chain,
    isPlainObject,
    cloneDeep
  } from 'lodash-es'
  import { useVModel } from '@vueuse/core'
  import { type FormRules, type FormInstance } from 'element-plus'
  import { transitionHeight } from '../../utils'
  const props = defineProps({
    config: {
      type: Array as PropType<Array<FormConfigItemType>>,
      default: () => []
    },
    modelValue: {
      type: Object,
      default: () => ({})
    },
    readonly: {
      type: Boolean,
      default: false
    },
    labelSuffix: {
      type: String,
      default: ''
    },
    /**  label最大宽度，超出省略号 */
    mexLabelWidth: {
      type: String,
      default: '160px'
    },
    /**  响应式栅格（默认）、固定栅格*/
    isResponseGrid: {
      type: Boolean,
      default: false
    },
    /** 是否展示最后一个按钮栅格 */
    showLastCol: {
      type: Boolean,
      default: false
    },
    /** 按钮是否独占一行，使用于有额外按钮的情况 */
    buttonInRow: {
      type: Boolean,
      default: false
    },
    /** 查询按钮是否设置为native-type=submit */
    submitButton: {
      type: Boolean,
      default: true
    },
    /** 按钮的显示 */
    showActionBtn: {
      type: Boolean,
      default: true
    },
    /** 查询重置按钮的loading */
    loading: {
      type: Boolean,
      default: false
    },
    /** 是否开启折叠动画 */
    animation: {
      type: Boolean,
      default: true
    },
    /** 是否默认折叠 */
    defaultCollapse: {
      type: Boolean,
      default: false
    },
    /** 默认一行的列数 */
    colNumber: {
      type: Number,
      default: 0
    }
  })
  const emits = defineEmits(['update:modelValue', 'focus', 'search', 'reset'])

  const formRef = ref<FormInstance>(null)

  const getLabel = (item) => {
    let value = formData.value[item.prop]
    const textField = item.compConfig?.textField || defaultTextField
    const type = item.customType
    // 自定义类型为string，则直接返回
    if (!item.type && type && typeof type === 'string') {
      return type
    }
    if (isNil(value)) {
      return '' // 空值返回空字符串
    }
    if (isString(value) || isNumber(value)) {
      return String(value) // 字符串或数字直接返回
    }
    if (isArray(value)) {
      // 处理数组（可能是 string[]、number[]、object[]）
      return chain(value)
        .map((item) => {
          if (isPlainObject(item) && Reflect.has(item, textField)) {
            return item[textField] // 提取对象中的 label
          }
          return String(item) // 其他类型转为字符串
        })
        .compact() // 移除空值（null/undefined）
        .join(', ') // 组合为逗号分隔的文本
        .value()
    }
    if (isPlainObject(value)) {
      return String((value as Record<string, unknown>)[textField] || '') // 纯对象提取 label
    }
    return '' // 其他情况返回空字符串
  }

  // #region 栅格及查询重置按钮的处理
  const originBreakPoint = reactive({
    xs: 24,
    sm: 12,
    md: 12,
    lg: 8,
    xl: 6
  })
  const defaultCollapseState = ref(props.defaultCollapse)
  const gridCollapseRef = ref<HTMLElement | null>(null)
  const colRefs = ref<ComponentPublicInstance[]>([])

  const breakPoint = reactive(cloneDeep(originBreakPoint))
  const getColSpan = (item: FormConfigItemType, type: string) => {
    // 如果按钮独占一行，将它的栅格设置为24
    if (props.buttonInRow) {
      Object.keys(originBreakPoint).forEach((k) => {
        originBreakPoint[k] = 24
      })
    }
    // 如果开启全局列设置
    if (props.colNumber) {
      Object.keys(breakPoint).forEach((k) => {
        breakPoint[k] = 24 / props.colNumber
      })
    }
    // 其它共存模式
    if (props.isResponseGrid && item?.colNumber) {
      return 24 / item?.colNumber
    } else if (props.isResponseGrid) {
      return breakPoint[type]
    }
    return item?.colNumber
      ? 24 / item?.colNumber
      : props.colNumber
        ? 24 / props.colNumber
        : 12
  }
  /** 按钮列所占栅格数量，为0则单独起一行，为1则占最后一个栅格 */
  const buttonColCount = computed(() => {
    if (props.buttonInRow) {
      Object.keys(originBreakPoint).forEach((k) => {
        originBreakPoint[k] = 24
      })
      return 0
    }
    return 1
  })
  /** 隐藏栅格的条件 */
  const hiddenCol = (index: number, key: keyof typeof breakPoint) => {
    return (
      defaultCollapseState.value &&
      index + 1 > Math.ceil(24 / breakPoint[key] - buttonColCount.value)
    )
  }
  const search = () => {
    emits('search')
  }
  const reset = () => {
    formRef.value && formRef.value?.resetFields()
    emits('reset')
    search()
  }
  const toggleCollapse = () => {
    if (props.animation) {
      transitionHeight(gridCollapseRef.value!, defaultCollapseState.value)
    }
    defaultCollapseState.value = !defaultCollapseState.value
    colRefs.value.forEach((r) => {
      let classList = r.$el.classList
      Object.keys(breakPoint).forEach((k) => {
        if (classList.contains(`hidden-${k}-only`)) {
          classList.remove(`hidden-${k}-only`)
        } else {
          if (classList.contains(k)) {
            classList.add(`hidden-${k}-only`)
          }
        }
      })
    })
  }
  // #endregion 栅格及查询重置按钮的处理-end

  const getFormComp = (item: FormConfigItemType) => {
    if (item.type) {
      return typeof item.type === 'string' ? compMap[item.type] : item.type
    }
    // 处理string类型
    if (typeof item.customType === 'string') return () => item.customType
    return item.customType
  }

  // 事件键值前加上on
  const transformEventName = (
    events?: Record<string, (...args: unknown[]) => unknown>
  ) => {
    if (!events) return {}
    return Object.keys(events).reduce((prev: typeof events, k) => {
      prev[`on${k.toUpperCase()[0]}${k.slice(1)}`] = events[k]
      return prev
    }, {})
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formData = useVModel(props, 'modelValue', emits)

  // 模拟远程获取数据
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getDataByCode = async (): Promise<any> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { label: '选项1', value: 1 },
          { label: '选项2', value: 2 }
        ])
      }, 1000)
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options = ref<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getOptions = async (item: FormConfigItemType, index: number) => {
    const code = item?.compConfig?.code
    const customRequest = item?.compConfig?.customRequest
    const customParams = item?.compConfig?.customParams

    if (customRequest && typeof customRequest === 'function') {
      // 自定义查询
      const { data } = await customRequest(customParams)
      options.value[index] = data || []
    } else if (code) {
      // 通过code查询数据
      const { data } = await getDataByCode()
      options.value[index] = data || []
    } else {
      // 否则返回customOptions
      options.value[index] =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        item?.compConfig?.customOptions || []
    }
  }

  // 获取初始数据，也可以传入focusGetData在focus时获取数据
  // todo 这里如果表单的查询比较多，可以异步队列调用
  watchEffect(() => {
    props.config.forEach(async (item, index) => {
      if (!item.compConfig?.focusGetData) {
        await getOptions(item, index)
      }
    })
  })

  // focus事件获取数据
  const compFocus = async (item: FormConfigItemType, index: number) => {
    emits('focus')
    if (item.compConfig?.focusGetData) {
      await getOptions(item, index)
    }
  }

  // rules校验
  const rules = ref<FormRules>({})
  watchEffect(() => {
    if (props.readonly) return
    rules.value = props.config
      .filter((item) => {
        if (item.customType && typeof item.customType === 'string') {
          return false
        }
        return item.required || item.rule
      })
      .reduce((prev: Record<string, object>, item) => {
        if (item.rule) {
          prev[item.prop] = item.rule
          return prev
        }
        prev[item.prop] = [
          {
            required: true,
            message: `${item.label}为必填项`,
            trigger: 'blur'
          },
          {
            required: true,
            message: `${item.label}为必填项`,
            trigger: 'change'
          }
        ]
        return prev
      }, {})
  })
  const labelTooltipVisibleArr = ref(
    Array.from({ length: props.config.length || 100 }, () => ({
      visible: false
    }))
  )

  const labelMouseEneter = (e: MouseEvent, index: number) => {
    const tar = e.target as HTMLElement
    if (tar.scrollWidth > tar.clientWidth) {
      labelTooltipVisibleArr.value[index].visible = true
    } else {
      labelTooltipVisibleArr.value[index].visible = false
    }
  }
  const labelMouseLeave = (index: number) => {
    labelTooltipVisibleArr.value[index].visible = false
  }

  onMounted(() => {
    formRef.value && formRef.value?.resetFields()
    formRef.value && formRef.value?.clearValidate()
  })

  defineExpose({
    get formRef() {
      return formRef.value
    }
  })
</script>

<style lang="less" scoped>
  @import 'element-plus/theme-chalk/display.css';

  .r-form-box {
    position: relative;
    height: auto;
    overflow: hidden;
    padding: 12px;
    .col-opacity-1 {
      opacity: 1;
    }
    .slot-el-row {
      width: 100%;
      // align-items: end;
      & > .el-col {
        margin-bottom: v-bind('props.showLastCol?"12px":"0px"');
        & > :deep(.el-form-item) {
          margin-bottom: v-bind('props.showLastCol?"0px":"18px"');
        }
      }
      .readonly-item-text {
        word-break: break-all;
      }
      .custom-form-item-label {
        width: 100%;
        max-width: v-bind('props.mexLabelWidth');
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .expand-or-collapse {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-left: auto;
      color: var(--el-color-primary, #409eff);
      cursor: pointer;
      padding: 4px 0;
      .button-col {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        .left {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          overflow: hidden;
        }
        .right {
          display: flex;
          align-items: center;
          overflow: hidden;
          padding-left: 12px;
          .text {
            padding: 0 5px 0 10px;
            user-select: none;
          }
        }
      }
    }
  }
</style>
