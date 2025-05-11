<template>
  <div class="layout">
    <LayoutHeader></LayoutHeader>
    <el-watermark
      content="watermark"
      :font="font"
      :z-index="5000"
      :offset="[50, 50]"
      class="layout-main">
      <nav class="layout-left">
        <LayoutNav></LayoutNav>
      </nav>
      <div class="layout-right">
        <main class="main-box">
          <el-scrollbar
            ref="scrollBarRef"
            v-if="$route.meta.noUseGlobalScrollbar !== true"
            view-class="self-scrollbar-view"
            wrap-class="self-scrollbar-wrap">
            <div class="router-view-box">
              <router-view #default="{ Component }">
                <transition name="main" appear>
                  <component :is="Component"></component>
                </transition>
              </router-view>
            </div>
          </el-scrollbar>
          <div v-else class="router-view-box">
            <router-view #default="{ Component }">
              <transition name="main" appear>
                <component :is="Component"></component>
              </transition>
            </router-view>
          </div>
        </main>
      </div>
    </el-watermark>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, reactive, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import LayoutHeader from './LayoutHeader.vue'
  import LayoutNav from './LayoutNav.vue'
  import { useCommonStore } from '@/store/common.ts'

  const route = useRoute()

  const commonStore = useCommonStore()
  const font = reactive({
    fontSize: 18,
    color: 'rgba(0, 0, 0, 0.1)'
  })
  const scrollBarRef = ref<{ update: () => void }>()
  watch(
    () => commonStore.webStyle,
    (newVal) => {
      switch (newVal) {
        case 1:
          font.color = 'rgba(255, 255, 255, 0.06)'
          break
        case 2:
          font.color = 'rgba(0, 0, 0, 0.06)'
          break
        default:
          font.color = 'rgba(255, 255, 255, 0.04)'
          break
      }
    },
    { immediate: true }
  )
  // 由于滚动条组件是公用的，这里更新滚动条状态，防止切换时出现上个页面的滚动条
  watch(
    () => route.path,
    () => {
      setTimeout(() => {
        if (scrollBarRef.value) {
          scrollBarRef.value.update()
        }
      }, 100)
    }
  )
  onMounted(() => {
    if (scrollBarRef.value) {
      scrollBarRef.value.update()
    }
  })
</script>

<style lang="less" scoped>
  .layout {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;

    .layout-main {
      flex: 1;
      height: 0;
      display: flex;
    }
    .layout-left {
      display: flex;
      flex-direction: column;
      height: 100%;
      box-shadow: 0px 4px 8px 0px var(--border-shadow-color);
      z-index: 199;
      .el-scrollbar {
        flex: 1;
        background-color: var(--main-bg-color);
        // box-shadow: 0.5rem 0 2rem #000;
      }
    }
    .layout-right {
      flex: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      .main-box {
        position: relative;
        flex: 1;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background-color: var(--section-bg-color);
        // & > .el-scrollbar {
        //   :deep(.self-scrollbar-wrap) {
        //     // padding: 24px;
        //   }
        // }
        .router-view-box {
          padding: v-bind('route.name!=="home"?"24px":0');
          height: 100%;
        }
      }
    }
  }

  .main-enter-active {
    transition: all 0.4s ease-in-out;
  }
  .main-enter-from {
    opacity: 0;
    transform: translateX(-20px);
  }
</style>
