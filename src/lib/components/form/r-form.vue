<template>
  <el-form
    ref="formRef"
    :model="formData"
    v-bind="{
      labelWidth: 'auto',
      validateOnRuleChange: false,
      ...$attrs,
      ...{ rules }
    }">
    <el-row :gutter="20">
      <el-col
        v-for="(item, index) in props.config"
        :key="item.prop"
        :span="getColSpan(item)">
        <el-form-item
          v-bind="{
            prop: item.prop,
            label: item.label,
            ...item?.itemConfig
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
            <span>&nbsp;:</span>
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
          <span v-if="props.readonly" class="form-item-text">
            {{ getLabel(formData[item.prop], item.compConfig?.textField) }}
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
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
  import { ref, watchEffect, PropType } from 'vue'
  import { compMap } from './config'
  import { defaultTextField } from './const'
  import { type ConfigItemType } from './types'
  import {
    isNil,
    isString,
    isNumber,
    isArray,
    chain,
    isPlainObject,
    isEmpty
  } from 'lodash-es'
  import { useVModel } from '@vueuse/core'
  import { type FormRules } from 'element-plus'
  // todo 栅格
  const props = defineProps({
    config: {
      type: Array as PropType<Array<ConfigItemType>>,
      default: () => []
    },
    modelValue: {
      type: Object,
      default: () => ({})
    },
    readonly: {
      type: Boolean,
      default: false
    }
  })
  const emits = defineEmits(['update:modelValue', 'focus'])

  const formRef = ref(null)

  const getLabel = (value: unknown, textField = defaultTextField) => {
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

  const getColSpan = (item: ConfigItemType) => {
    return item?.colNum ? 24 / item?.colNum : 12
  }

  const getFormComp = (item: ConfigItemType) => {
    return item.type ? compMap[item.type] : item.customType
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
  const getOptions = async (item: ConfigItemType, index: number) => {
    const code = item?.compConfig?.code
    if (code) {
      // 通过code查询数据
      options.value[index] = await getDataByCode()
    } else {
      // 返回customOptions
      options.value[index] =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        item?.compConfig?.customOptions || []
    }
  }

  // code不存在时，自动获取customOptions，顺便扩展_tootipVisible字段
  watchEffect(() => {
    props.config.forEach(async (item, index) => {
      if (
        !item?.compConfig?.code &&
        item?.compConfig?.customOptions &&
        isEmpty(options.value[index])
      ) {
        await getOptions(item, index)
      }
    })
    console.log(props.config, '11232')
  })

  // code存在时，focus事件获取数据
  const compFocus = async (item: ConfigItemType, index: number) => {
    emits('focus')
    if (item.type?.includes('select')) {
      await getOptions(item, index)
    }
  }

  // rules校验
  const rules = ref<FormRules>({})
  watchEffect(() => {
    if (props.readonly) return
    rules.value = props.config
      .filter((item) => item.required || item.rule)
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

  defineExpose({
    formRef
  })
</script>

<style lang="less" scoped>
  .form-item-text {
    word-break: break-all;
  }
  .custom-form-item-label {
    width: 100%;
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
