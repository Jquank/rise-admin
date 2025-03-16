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
      <el-form label-width="auto" :model="searchModel">
        <el-form-item prop="value1" label="分组1分组1">
          <el-input v-model="searchModel.value1" />
        </el-form-item>
        <el-form-item prop="value2" label="分组2">
          <el-input v-model="searchModel.value2" />
        </el-form-item>
        <el-form-item prop="value3" label="分组3">
          <el-input v-model="searchModel.value3" />
        </el-form-item>
        <el-form-item prop="value4" label="分组4">
          <el-input v-model="searchModel.value4" />
        </el-form-item>
        <el-form-item prop="value5" label="分组5">
          <el-input v-model="searchModel.value5" />
        </el-form-item>
        <el-form-item prop="value6" label="分组6">
          <el-input v-model="searchModel.value6" />
        </el-form-item>
      </el-form>
    </GridCollapse>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import GridCollapse from '@/components/GridCollapse.vue'

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
    .grid-collapse-box {
      padding: 18px 12px 0;
      background-color: var(--main-bg-color);
      margin-bottom: 18px;
    }
  }
</style>
