<template>
  <div>
    <RForm ref="formRef" :config="formConfig" v-model="formData"></RForm>
    {{ formData }}
    <el-button @click="aaa">1111111</el-button>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  // import { RForm, type FormConfigItemType } from '@jquank/rise-ui'
  import { RForm, type FormConfigItemType } from '@/lib/components/form'
  const aaa = () => {
    formRef.value?.formRef
      ?.validate()
      .then(() => {
        console.log('校验成功')
      })
      .catch((err) => {
        console.log('校验失败', err)
      })
  }
  const formData = ref({})
  const formRef = ref(null)
  const sexDisabled = ref(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const checkDemo = (_: any, value: any, callback: any) => {
    if (!value) {
      callback(new Error('请输入团队'))
    } else {
      callback()
    }
  }
  const formConfig = computed<FormConfigItemType[]>(() => {
    return [
      {
        prop: 'name1',
        label: '名称1',
        customType: '111',
        required: true
      },
      {
        prop: 'name2',
        label: '名称2',
        type: 'input',
        required: true
      },
      {
        prop: 'name3',
        label: '名称3',
        type: 'input',
        required: true
      },
      {
        prop: 'name',
        label: '名称1111111111111111111111111',
        type: 'input',
        required: true,
        // itemConfig: {
        //   slots: [
        //     {
        //       name: 'label',
        //       content: {
        //         type: 'html',
        //         value: '<h1>1111</h1>'
        //       }
        //     }
        //   ]
        // },
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
        prop: 'remark',
        label: '建议',
        type: 'editor',
        required: true,
        colNumber: 1,
        compConfig: {}
      },
      {
        prop: 'isStrat',
        label: '是否开启111111111111111111111111',
        type: 'radio',
        compConfig: {
          textField: 'label1',
          valueField: 'value1',
          customOptions: radioOptions.value
        }
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
