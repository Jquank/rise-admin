<template>
  <el-config-provider :z-index="3000" :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
  import en from 'element-plus/dist/locale/en.mjs'
  const langsMap = {
    zh: zhCn,
    en: en
  }
  const language = (localStorage.getItem('locale') ||
    'zh') as keyof typeof langsMap
  const locale = ref(langsMap[language] || langsMap.zh)
</script>
