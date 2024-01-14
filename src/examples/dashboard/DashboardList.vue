<template>
  <div>
    <h1>看板列表</h1>
    <!-- <router-link :to="{ name: 'dashboard-detail', params: { id: '123' } }"
    >to detail</router-link
  > -->
    <el-button @click="toDetail">to detail</el-button>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  const router = useRouter()
  console.log(router.getRoutes())
  const toDetail = () => {
    router.push({ name: 'dashboard-detail', params: { id: 123 } })
  }
</script>

<style lang="less" scoped></style>
