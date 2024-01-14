<template>
  <el-card class="not-found-card">
    <div class="title">404 Page Not Found</div>
    <el-button @click="toHome">take me home</el-button>
  </el-card>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router'
  const router = useRouter()
  const toHome = () => {
    router.replace('/home')
  }
</script>

<style class="less" scoped>
  .not-found-card {
    margin-top: 30px;
    text-align: center;
    .title {
      font-size: 24px;
      font-weight: 500;
      margin-bottom: 30px;
    }
  }
</style>
