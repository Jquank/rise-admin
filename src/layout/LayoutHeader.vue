<template>
  <header class="header">
    <div class="header-left">
      <div class="logo">
        <div @click="expandMenu" class="expand-icon-box">
          <SvgIcon
            :icon="
              commonStore.isCollapse
                ? 'a-fenleizhediecebianlan'
                : 'a-cebianlanfenleizhedie'
            "
            :size="18"
          />
        </div>
        <!-- <img class="logo-img" src="../assets/images/web-logo.jpg" alt="logo" /> -->
        <span class="logo-text">Rise Admin</span>
      </div>
      <!-- <div class="bread-nav">
        <div
          v-for="(item, index) in currentRouteMatched"
          :key="item.name || item.path"
          class="bread-nav-item"
        >
          <div>{{ item.meta.title }}</div>
          <div
            class="separator"
            v-if="index !== currentRouteMatched.length - 1"
          >
            >
          </div>
        </div>
      </div> -->
    </div>
    <div class="header-right">
      <el-dropdown>
        <div class="header-handle-box">
          <SvgIcon icon="language-sharp" :size="20"></SvgIcon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="item in langs"
              :key="item.key"
              @click="changeLanguage(item.key)"
              >{{ item.title }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-dropdown>
        <div class="header-handle-box">
          <el-avatar>
            <SvgIcon icon="user" :size="20"></SvgIcon>
          </el-avatar>
          <span class="username">{{ commonStore.userInfo.username }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="loginOut">{{
              $t('common.loginOut')
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="setting" @click="drawer = !drawer">
      <SvgIcon icon="icon_shezhi" :size="20" color="#fff"></SvgIcon>
    </div>
    <el-drawer
      v-model="drawer"
      :with-header="false"
      modal-class="theme-setting-drawer"
    >
      <div class="block">
        <div class="title">整体风格</div>
        <div class="square-box">
          <div
            v-for="(item, index) in webStyleList"
            :key="item"
            :class="'square-color ' + 'square-color-' + item"
            @click="settingStyle(item, index)"
          >
            <div
              class="selected"
              :style="{
                display: activeIndexStyle === index ? 'block' : 'none'
              }"
            >
              <SvgIcon
                icon="selected"
                color="var(--el-color-primary)"
                :size="30"
              ></SvgIcon>
            </div>
          </div>
        </div>
      </div>
      <div class="block">
        <div class="title">主题色</div>
        <div class="square-box">
          <div
            v-for="(item, index) in themeColorList"
            :key="item.type"
            class="square-color square-color-small"
            :style="{ 'background-color': item.color }"
            @click="settingTheme(item, index)"
          >
            <div
              class="selected"
              :style="{
                display: activeIndexTheme === index ? 'block' : 'none'
              }"
            >
              <SvgIcon icon="selected" color="#fff" :size="20"></SvgIcon>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </header>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { langs } from '@/locales/index.ts'
  import { rgbChange } from '@/utils/common.ts'
  import { useCommonStore } from '@/store/common.ts'

  interface SelfEvent extends Event {
    resizeEcharts: boolean
  }

  const router = useRouter()
  const commonStore = useCommonStore()
  const drawer = ref(false)
  const webStyleList = ['default', 'dark', 'light']
  const themeColorList = [
    { type: 'blue', color: 'rgb(64, 158, 255)' },
    { type: 'darkblue', color: 'rgb(47, 84, 235)' },
    { type: 'red', color: 'rgb(245, 34, 45)' },
    { type: 'lightred', color: 'rgb(250, 84, 28)' },
    { type: 'yellow', color: 'rgb(250, 173, 20)' },
    { type: 'green', color: 'rgb(82, 196, 26)' },
    { type: 'darkgreen', color: 'rgb(19, 194, 194)' },
    { type: 'pink', color: 'rgb(114, 46, 209)' }
  ]
  let activeIndexStyle = ref(commonStore.webStyle)
  let activeIndexTheme = ref(
    JSON.parse(localStorage.getItem('themeColor') || '0')
  )
  let diffList = [
    'dark-2',
    'light-3',
    'light-5',
    'light-7',
    'light-8',
    'light-9'
  ]

  const expandMenu = () => {
    commonStore.isCollapse = !commonStore.isCollapse
    // 展开折叠时派发resize事件(动画结束后)，更新echarts
    let ev = new Event('resize') as SelfEvent
    ev.resizeEcharts = true
    setTimeout(() => {
      window.dispatchEvent(ev)
    }, 150)
  }
  // 设置语言
  const changeLanguage = (key: string) => {
    localStorage.setItem('locale', key)
    router.go(0)
  }

  const htl = document.documentElement
  // 根据主题色，设置element的一些附属颜色
  const initElementPlusPrimaryColor = (primaryColor: string) => {
    // 设置主题色的附属颜色，如果是element的默认色，不作处理
    if (primaryColor === '#409EFF' || primaryColor === 'rgb(64, 158, 255)') {
      htl.removeAttribute('style')
    } else {
      htl.style.setProperty('--el-color-primary', primaryColor)
      let mainColor =
        getComputedStyle(htl).getPropertyValue('--el-color-primary')
      let operator = webStyleList[activeIndexStyle.value] === 'light' ? 1 : -1
      diffList.forEach((str) => {
        htl.style.setProperty(
          `--el-color-primary-${str}`,
          rgbChange(
            mainColor,
            str.substring(0, 4) === 'dark'
              ? 20 * operator
              : +str.substring(6) * 12 * operator
          )
        )
      })
    }
  }

  // 初始化整体风格，和主题色
  const initStyle = () => {
    if (
      typeof activeIndexStyle.value === 'number' &&
      activeIndexStyle.value >= 0 &&
      activeIndexStyle.value < webStyleList.length
    ) {
      htl.classList.remove(...webStyleList)
      htl.classList.add(webStyleList[activeIndexStyle.value])
    }
    if (
      typeof activeIndexTheme.value === 'number' &&
      activeIndexTheme.value > 0 &&
      activeIndexTheme.value < themeColorList.length
    ) {
      initElementPlusPrimaryColor(themeColorList[activeIndexTheme.value].color)
    }
  }

  initStyle()

  // 设置风格
  const settingStyle = (type: string, index: number) => {
    htl.classList.remove(...webStyleList)
    htl.classList.add(type)
    commonStore.webStyle = index
    activeIndexStyle.value = index
    localStorage.setItem('webStyle', index + '')
    initElementPlusPrimaryColor(themeColorList[activeIndexTheme.value].color)
  }
  // 设置主题色
  const settingTheme = (
    item: { type: string; color: string },
    index: number
  ) => {
    initElementPlusPrimaryColor(item.color)
    localStorage.setItem('themeColor', index + '')
    activeIndexTheme.value = index
  }

  const loginOut = () => {
    sessionStorage.clear()
    router.replace('/login')
  }
</script>

<style lang="less" scoped>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 200;
    height: 60px;
    text-align: center;
    color: var(--header-text-color);
    background-color: var(--header-bg-color);
    box-shadow: 0px 4px 8px 0px var(--border-shadow-color);
    .header-handle-box {
      display: flex;
      align-items: center;
      cursor: pointer;
      min-height: 40px;
      padding: 0 18px;
      border-radius: 4px;
      &:hover {
        background-color: var(--bg-fill-color);
      }
      &:focus-visible {
        outline: none;
      }
    }
    .setting {
      position: fixed;
      top: 35%;
      right: 0;
      width: 30px;
      height: 30px;
      background-color: var(--el-color-primary);
      border-bottom-left-radius: 5px;
      border-top-left-radius: 5px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .header-left {
      display: flex;
      align-items: center;
      height: 100%;
      .expand-icon-box {
        cursor: pointer;
        padding-right: 15px;
      }
      .logo {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.4rem;
        font-weight: bold;
        overflow: hidden;
        padding-left: 1rem;
        .logo-img {
          width: 20px;
        }
      }
      .bread-nav {
        display: flex;
        align-items: center;
      }
      .bread-nav-item {
        display: flex;
        align-items: center;
      }
      .separator {
        padding: 0 5px;
      }
    }
    .header-right {
      height: 100%;
      display: flex;
      align-items: center;
      padding-right: 24px;
      .username {
        margin-left: 10px;
        font-size: 16px;
      }
      // :deep(.el-dropdown:focus-visible) {
      //   outline: none;
      // }
    }
  }
  .theme-setting-drawer {
    .block {
      text-align: left;
      margin-top: 20px;
      .title {
        padding-left: 10px;
        font-size: 16px;
        font-weight: 500;
      }
      .square-box {
        display: flex;
        flex-wrap: wrap;
        margin-top: 12px;

        .square-color {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 80px;
          height: 80px;
          background-color: #fff;
          border-radius: 5px;
          cursor: pointer;
          border: 1px solid var(--el-color-primary);
          margin: 10px 0 0 15px;
          &-default {
            background-color: @main-bg-color-default;
          }
          &-light {
            background-color: @main-bg-color-light;
          }
          &-dark {
            background-color: @main-bg-color-dark;
          }
          &-small {
            width: 30px;
            height: 30px;
            border: none;
          }
        }
      }
    }
  }
</style>
