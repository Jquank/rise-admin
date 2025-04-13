<template>
  <div>
    <r-form ref="formRef" :config="formConfig" v-model="formData"></r-form>
    {{ formData }}
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { RForm, type ConfigItemType } from '@jquank/rise-ui'
  const formData = ref<object>({})
  const formRef = ref()
  const sexDisabled = ref(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const checkDemo = (_: any, value: any, callback: any) => {
    if (!value) {
      callback(new Error('请输入团队'))
    } else {
      callback()
    }
  }
  const formConfig = computed<ConfigItemType[]>(() => {
    return [
      {
        prop: 'name',
        label: '名称',
        type: 'input',
        required: true,
        compConfig: {
          disabled: sexDisabled.value
          // slots: [
          //   {
          //     name: 'prepend',
          //     content: {
          //       type: markRaw(RSelect),
          //       value: {
          //         modelValue: { label: '选项1', value: 1 },
          //         optionData: [
          //           { label: '选项1', value: 1 },
          //           { label: '选项2', value: 2 }
          //         ],
          //         onChange(val: unknown) {
          //           console.log(val, 'change')
          //         }
          //       }
          //     }
          //   },
          //   {
          //     name: 'append',
          //     content: { type: 'html', value: '<h1>2222</h1>' }
          //   }
          // ]
        }
      },
      {
        prop: 'team',
        label: '团队',
        type: 'select',
        rule: [{ required: true, validator: checkDemo, trigger: 'change' }],
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
          textField: 'label1',
          valueField: 'value1',
          customOptions: radioOptions.value
        }
      },
      {
        prop: 'remark',
        label: '建议',
        type: 'editor',
        colNum: 1,
        compConfig: {}
      }
    ]
  })

  setTimeout(() => {
    // sexDisabled.value = true
    formData.value = {
      name: '张三wwwwwwwwwwwwwwwwwwwwwwwwwwweeeeeeeeeeeeeeerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
      team: null,
      isStrat: { label1: '是', value1: '1' },
      remark: '建议1111111'
    }
  }, 200)

  const radioOptions = ref([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getData = async (): Promise<any> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { label1: '是', value1: '1' },
          { label1: '否', value1: '0' }
        ])
      }, 1000)
    })
  }
  getData().then((res) => {
    radioOptions.value = res
  })

  onMounted(() => {
    console.log(formRef.value?.formRef, 'formRef.value')
  })
</script>

<style lang="less" scoped></style>
