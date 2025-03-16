<template>
  <div>
    <r-form :config="formConfig" :model="formData"></r-form>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, markRaw } from 'vue'
  import RForm, { type ConfigItemType } from '@/components/form/index'
  import Editor from '@/components/EditorTinymce.vue'
  const formData = ref<object>({})
  const sexDisabled = ref(false)
  const formConfig = computed<ConfigItemType[]>(() => {
    return [
      {
        prop: 'name',
        label: '姓名',
        customType: markRaw(Editor),
        compConfig: {}
      },
      {
        prop: 'sex',
        label: '姓别',
        type: 'select',
        compConfig: {
          disabled: sexDisabled.value
        }
      }
    ]
  })

  setTimeout(() => {
    sexDisabled.value = true
    formData.value = {
      name: '张三',
      sex: '男'
    }
  }, 3000)
</script>

<style lang="less" scoped></style>
