<template>
  <div class="menu-auth">
    <h3>点击下方按钮切换角色</h3>
    <el-radio-group
      style="
        width: 100%;
        margin-top: 20px;
        display: flex;
        justify-content: center;
      "
      v-model="auth"
      @change="radioChange"
    >
      <el-radio label="admin" border></el-radio>
      <el-radio label="user" border></el-radio>
    </el-radio-group>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useCommonStore } from '@/store/common'
  import { getToken } from '@/api/user'
  import { useRouter } from 'vue-router'
  const router = useRouter()
  const commonStore = useCommonStore()
  const auth = ref(commonStore.userInfo.username)
  const radioChange = async (value: string | number | boolean) => {
    let token = await getToken({ username: value as string, passward: '' })
    sessionStorage.setItem('token', JSON.stringify(token))
    router.go(0)
  }
</script>

<style lang="less" scoped>
  .menu-auth {
    background: var(--main-bg-color);
    height: 500px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>
@/api/modules/user/login
