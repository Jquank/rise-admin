<template>
  <div>
    <r-form :config="formConfig" :model="formData"></r-form>
    {{ formData }}
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import RForm, { type ConfigItemType } from '@/components/form/index'
  const formData = ref<object>({})
  const sexDisabled = ref(false)
  const formConfig = computed<ConfigItemType[]>(() => {
    return [
      {
        prop: 'name',
        label: '名称',
        type: 'input',
        compConfig: {
          disabled: sexDisabled.value
        }
      },
      {
        prop: 'team',
        label: '团队',
        type: 'select',
        compConfig: {
          code: 'team',
          events: {
            change: (val: number | string) => {
              console.log(val, 'change')
            }
          }
        }
      },
      {
        prop: 'isStrat',
        label: '是否开启',
        type: 'radio',
        compConfig: {
          customOptions: radioOptions.value
        }
      },
      {
        prop: 'remark',
        label: '建议',
        type: 'editor',
        compConfig: {}
      }
    ]
  })

  setTimeout(() => {
    // sexDisabled.value = true
    formData.value = {
      name: '张三'
    }
  }, 3000)

  const radioOptions = ref([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getData = async (): Promise<any> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { label: '是', value: '1' },
          { label: '否', value: '0' }
        ])
      }, 1000)
    })
  }
  getData().then((res) => {
    radioOptions.value = res
  })
</script>

<style lang="less" scoped></style>
