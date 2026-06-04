<template>
  <div class="login-wrapper">
    <!-- 左侧品牌区 -->
    <div class="login-left">
      <div class="brand-content">
        <div class="brand-icon">
          <svg
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <rect
              width="64"
              height="64"
              rx="16"
              fill="currentColor"
              fill-opacity="0.15" />
            <path
              d="M20 44V20l12 10 12-10v24"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round" />
            <circle cx="32" cy="28" r="3" fill="currentColor" />
          </svg>
        </div>
        <h1 class="brand-name">Plume</h1>
        <p class="brand-desc">AI 驱动的智能图文创作平台</p>
        <div class="brand-features">
          <span>🎨 AI 生图</span>
          <span>📝 热点成文</span>
          <span>⚡ 极速出稿</span>
        </div>
      </div>
    </div>

    <!-- 右侧登录区 -->
    <div class="login-right">
      <div class="login-box">
        <h2 class="login-title">{{ isRegister ? '创建账号' : '欢迎回来' }}</h2>
        <p class="login-subtitle">
          {{ isRegister ? '注册后即可使用全部 AI 功能' : '登录您的账号以继续' }}
        </p>
        <div class="login-form">
          <el-input
            v-model="username"
            placeholder="用户名"
            :prefix-icon="User"
            size="large"
            clearable />
          <el-input
            v-model="password"
            class="form-item"
            type="password"
            placeholder="密码"
            :prefix-icon="Lock"
            size="large"
            show-password
            @keyup.enter="handleSubmit" />
          <el-input
            v-if="isRegister"
            v-model="confirmPassword"
            class="form-item"
            type="password"
            placeholder="确认密码"
            :prefix-icon="Lock"
            size="large"
            show-password
            @keyup.enter="handleSubmit" />
        </div>
        <p class="error-message">{{ errorMessage }}</p>
        <el-button
          @click="handleSubmit"
          type="primary"
          class="login-btn"
          size="large"
          :loading="loading">
          {{ isRegister ? '注 册' : '登 录' }}
        </el-button>
        <p class="toggle-mode">
          {{ isRegister ? '已有账号？' : '还没有账号？' }}
          <el-link type="primary" @click="toggleMode">
            {{ isRegister ? '去登录' : '立即注册' }}
          </el-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { User, Lock } from '@element-plus/icons-vue'
  import { useCommonStore } from '@/store/common.ts'
  import { authApi, userApi } from '@/_api/index'

  const commonStore = useCommonStore()
  const router = useRouter()
  const username = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const isRegister = ref(false)
  const loading = ref(false)
  const errorMessage = ref('')

  const toggleMode = () => {
    isRegister.value = !isRegister.value
    errorMessage.value = ''
    confirmPassword.value = ''
  }

  const handleSubmit = async () => {
    errorMessage.value = ''
    if (!username.value.trim()) {
      errorMessage.value = '请输入用户名'
      return
    }
    if (!password.value) {
      errorMessage.value = '请输入密码'
      return
    }
    if (isRegister.value && password.value !== confirmPassword.value) {
      errorMessage.value = '两次输入的密码不一致'
      return
    }
    loading.value = true
    try {
      if (isRegister.value) {
        await userApi.postUserRegister({
          username: username.value.trim(),
          password: password.value
        })
      }
      const { data } = await authApi.postAuthLogin({
        username: username.value.trim(),
        password: password.value
      })
      const token = data.token_type + ' ' + data.access_token
      localStorage.setItem('token', token)
      commonStore.initRouterFlag = false
      router.replace({ path: '/home' })
    } catch (err: any) {
      errorMessage.value =
        err?.message || err?.data?.message || '操作失败，请重试'
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    const webStyle = commonStore.webStyle
    const themeClass = ['default', 'dark', 'light'][webStyle] || 'default'
    document.documentElement.classList.add(themeClass)
  })
</script>

<style lang="less" scoped>
  .login-wrapper {
    display: flex;
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }

  // ===== 左侧品牌区 =====
  .login-left {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(
      135deg,
      var(--el-color-primary-light-5) 0%,
      var(--el-color-primary) 100%
    );
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -20%;
      width: 80%;
      height: 200%;
      background: radial-gradient(
        ellipse at center,
        rgba(255, 255, 255, 0.1) 0%,
        transparent 70%
      );
    }
  }

  .brand-content {
    position: relative;
    text-align: center;
    color: #fff;
    max-width: 360px;
    padding: 40px;
  }

  .brand-icon {
    width: 72px;
    height: 72px;
    margin: 0 auto 24px;
    color: #fff;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  .brand-name {
    font-size: 36px;
    font-weight: 700;
    margin: 0 0 12px;
    letter-spacing: 2px;
  }

  .brand-desc {
    font-size: 15px;
    opacity: 0.85;
    margin: 0 0 32px;
    line-height: 1.6;
  }

  .brand-features {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;

    span {
      padding: 6px 16px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 20px;
      font-size: 13px;
      backdrop-filter: blur(4px);
    }
  }

  // ===== 右侧登录区 =====
  .login-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--el-bg-color);
  }

  .login-box {
    width: 380px;
    padding: 48px 40px;
  }

  .login-title {
    font-size: 26px;
    color: var(--el-text-color-primary);
    margin: 0 0 8px;
    font-weight: 600;
  }

  .login-subtitle {
    font-size: 14px;
    color: var(--el-text-color-secondary);
    margin: 0 0 32px;
  }

  .login-form {
    display: flex;
    flex-direction: column;

    .form-item {
      margin-top: 16px;
    }

    // 覆盖浏览器自动填充的白色背景
    :deep(.el-input__inner) {
      &:-webkit-autofill,
      &:-webkit-autofill:hover,
      &:-webkit-autofill:focus {
        box-shadow: 0 0 0 1000px var(--el-fill-color-blank) inset !important;
        -webkit-text-fill-color: var(--el-text-color-primary) !important;
        caret-color: var(--el-text-color-primary);
        transition: background-color 5000s ease-in-out 0s;
      }
    }
  }

  .error-message {
    min-height: 20px;
    line-height: 20px;
    margin-top: 12px;
    font-size: 12px;
    color: var(--el-color-error);
  }

  .login-btn {
    width: 100%;
    margin-top: 8px;
  }

  .toggle-mode {
    margin-top: 20px;
    text-align: center;
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }

  // ===== 响应式：小屏隐藏左侧 =====
  @media (max-width: 768px) {
    .login-left {
      display: none;
    }
    .login-box {
      width: 100%;
      max-width: 380px;
      padding: 32px 24px;
    }
  }
</style>
