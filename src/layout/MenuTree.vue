<template>
  <template v-for="item in props.menuData" :key="item.name">
    <el-sub-menu
      v-if="item.children && item.children.length && item.meta?.show !== false"
      :index="item.path"
      popper-class="self-el-popper"
      :class="'el-sub-menu-deep' + item.meta?.deep"
    >
      <template #title>
        <SvgIcon v-if="item.meta?.icon" :icon="item.meta?.icon" />
        <span>{{ item.meta?.title }}</span>
      </template>
      <!-- 递归MenuTree -->
      <MenuTree
        :menuData="item.children"
        v-if="item.children && item.children.length"
      ></MenuTree>
    </el-sub-menu>
    <el-menu-item
      v-if="
        (!item.children || (item.children && !item.children.length)) &&
        item.meta?.show !== false
      "
      :index="item.path"
      :class="'el-menu-item-deep' + item.meta?.deep"
    >
      <SvgIcon v-if="item.meta?.icon" :icon="item.meta?.icon" />
      <span>{{ item.meta?.title }}</span>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
  import type { RouteRecordRaw } from 'vue-router'
  const props = defineProps<{
    menuData: RouteRecordRaw[]
  }>()
</script>
