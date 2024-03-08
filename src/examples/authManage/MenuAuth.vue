<template>
  <div class="padding-18" style="background: var(--main-bg-color)">
    <el-alert :closable="false">
      取角色所对应菜单的并集，通过addRoute添加动态路由
    </el-alert>
    <h3 class="mt-20">点击下方按钮切换账户</h3>
    <el-radio-group v-model="auth" @change="radioChange" class="mt-20">
      <el-radio label="admin" border></el-radio>
      <el-radio label="user" border></el-radio>
    </el-radio-group>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useCommonStore } from '@/store/common'
  import { useRouter } from 'vue-router'
  const router = useRouter()
  const commonStore = useCommonStore()
  const auth = ref(commonStore.userInfo.username)
  const radioChange = async (value: string | number | boolean) => {
    sessionStorage.setItem('token', value === 'admin' ? '1' : '2')
    router.go(0)
  }
</script>
