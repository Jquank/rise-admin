<template>
  <el-form
    ref="formRef"
    :model="formData"
    v-bind="{
      labelWidth: 'auto',
      labelSuffix: ' :',
      validateOnRuleChange: false,
      ...$attrs,
      ...{ rules }
    }">
    <template v-for="(item, index) in props.config" :key="item.prop">
      <el-form-item
        v-bind="{ prop: item.prop, label: item.label, ...item?.itemConfig }">
        <!-- readonly 渲染文本 -->
        <span v-if="props.readonly" class="form-item-text">
          {{ getLabel(formData[item.prop]) }}
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
          <!-- 处理插槽，支持text,html,组件 -->
          <template
            v-for="slot in item.compConfig?.slots || []"
            :key="slot.name"
            #[slot.name]>
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
    </template>
  </el-form>
</template>

<script setup lang="ts">
  import { ref, watchEffect } from 'vue'
  import { compMap } from './config'
  import { type ConfigItemType } from './type'
  import * as _ from 'lodash-es'
  // todo 表单提交传参
  const props = defineProps({
    config: {
      type: Array<ConfigItemType>,
      default: () => []
    },
    model: {
      type: Object,
      default: () => ({})
    },
    readonly: {
      type: Boolean,
      default: false
    }
  })

  const formRef = ref(null)

  const getLabel = (value: unknown) => {
    if (_.isNil(value)) {
      return '' // 空值返回空字符串
    }

    if (_.isString(value) || _.isNumber(value)) {
      return String(value) // 字符串或数字直接返回
    }

    if (_.isArray(value)) {
      // 处理数组（可能是 string[]、number[]、object[]）
      return _.chain(value)
        .map((item) => {
          if (_.isPlainObject(item) && Reflect.has(item, 'label')) {
            return item.label // 提取对象中的 label
          }
          return String(item) // 其他类型转为字符串
        })
        .compact() // 移除空值（null/undefined）
        .join(', ') // 组合为逗号分隔的文本
        .value()
    }
    if (
      _.isPlainObject(value) &&
      typeof value === 'object' &&
      'label' in value
    ) {
      return String(value?.label) // 纯对象提取 label
    }
    return '' // 其他情况返回空字符串
  }

  const getFormComp = (item: ConfigItemType) => {
    if (props.readonly) return 'span'
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
  const formData = ref<Record<string, any>>({})

  watchEffect(() => {
    formData.value = props.model
  })

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

  // code不存在时，自动获取customOptions
  watchEffect(() => {
    props.config.forEach(async (item, index) => {
      if (
        !item?.compConfig?.code &&
        item?.compConfig?.customOptions &&
        _.isEmpty(options.value[index])
      ) {
        await getOptions(item, index)
      }
    })
  })

  // code存在时，focus事件获取数据
  const compFocus = async (item: ConfigItemType, index: number) => {
    if (item.type?.includes('select')) {
      await getOptions(item, index)
    }
  }

  // rules校验
  const rules = ref<Record<string, unknown[]>>({})
  watchEffect(() => {
    if (props.readonly) return
    rules.value = props.config
      .filter((item) => item.required || item.rule)
      .reduce((prev: Record<string, unknown[]>, item) => {
        if (item.rule) {
          prev[item.prop] = item.rule
          return prev
        }
        prev[item.prop] = [
          {
            required: true,
            message: `${item.label || ''}为必填项`,
            trigger: 'blur'
          },
          {
            required: true,
            message: `${item.label || ''}为必填项`,
            trigger: 'change'
          }
        ]
        return prev
      }, {})
  })

  defineExpose({
    formRef
  })
</script>

<style lang="less" scoped>
  .form-item-text {
    word-break: break-all;
  }
</style>
