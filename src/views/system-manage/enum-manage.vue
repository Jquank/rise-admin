<template>
  <div class="enum-manage">
    <RForm
      @search="handleSearch"
      isResponseGrid
      showLastCol
      buttonInRow
      defaultCollapse
      :config="formConfig"
      v-model="searchModel">
      <template #left-buttons>
        <el-button type="primary">新建枚举</el-button>
      </template>
    </RForm>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import { RForm } from '@/lib/index'

  const searchModel = reactive({
    name: ''
  })
  const formConfig = [
    {
      prop: 'name',
      label: '名称',
      type: 'input'
    }
  ]
  const handleSearch = () => {}
</script>

<style lang="less" scoped>
  .enum-manage {
    height: 100%;
    background-color: var(--main-bg-color);
  }
</style>
