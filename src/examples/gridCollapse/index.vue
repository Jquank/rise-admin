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
