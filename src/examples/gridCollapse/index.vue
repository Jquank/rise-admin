<!--
 * @Author: gongjian 478197650@qq.com
 * @Date: 2024-01-09 22:33:39
 * @LastEditors: gongjian 478197650@qq.com
 * @LastEditTime: 2025-03-09 22:25:17
 * @FilePath: \rise\web\src\examples\gridCollapse\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="standrad-list">
    <GridCollapse class="grid-collapse-box">
      <el-input v-model="searchModel.value1" />
      <span>123</span>
      <el-input v-model="searchModel.value2" />
      <el-input v-model="searchModel.value3" />
      <span>123</span>
      <el-input v-model="searchModel.value5" />
      <el-input v-model="searchModel.value5" />
      <span>123</span>
      <el-input v-model="searchModel.value5" />
      <el-input v-model="searchModel.value5" />
      <el-input v-model="searchModel.value5" />
      <el-input v-model="searchModel.value5" />
      <el-input v-model="searchModel.value5" />
      <el-input v-model="searchModel.value5" />
    </GridCollapse>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import GridCollapse from '@/components/GridCollapseAuto.vue'

  const searchModel = reactive({
    value1: '',
    value2: '',
    value3: '',
    value4: '',
    value5: '',
    value6: '',
    value7: ''
  })
</script>

<style lang="less" scoped>
  .standrad-list {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: var(--main-bg-color);
    padding: 20px 12px;
  }
</style>
