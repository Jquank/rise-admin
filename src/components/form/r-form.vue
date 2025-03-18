<template>
  <el-form :model="props.model" v-bind="$attrs" label-width="auto">
    <template v-for="(item, index) in props.config" :key="item.prop">
      <el-form-item v-bind="{ ...$attrs, ...item }">
        <component
          :is="item.type ? compMap[item.type] : item.customType"
          v-bind="{
            ...item.compConfig,
            ...transformEventName(item?.compConfig?.events)
          }"
          v-model="formData[item.prop]"
          @focus="compFocus(item, index)"
          style="width: 100%">
          <template
            v-if="
              item.type &&
              (item?.compConfig?.code || item?.compConfig?.customOptions)
            ">
            <component
              :is="childCompMap[item.type] || null"
              v-for="v in options[index]"
              :key="v.id || v.value || v.label"
              :label="item.type === 'radio' ? v.value : v.label"
              :value="v.value"
              >{{ v.label }}</component
            >
          </template>
        </component>
      </el-form-item>
    </template>
  </el-form>
</template>

<script setup lang="ts">
  import { ref, watchEffect } from 'vue'
  import { compMap, childCompMap } from './config'
  import { type ConfigItemType } from './type'
  import { isEmpty } from 'lodash-es'
  // todo 表单校验，表单提交传参，表单只读模式
  const props = defineProps({
    config: {
      type: Array<ConfigItemType>,
      default: () => []
    },
    model: {
      type: Object,
      default: () => ({})
    }
  })

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
        isEmpty(options.value[index])
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
</script>

<style lang="less" scoped></style>
