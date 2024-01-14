<template>
  <el-scrollbar>
    <el-menu
      class="menu-box-el"
      router
      :default-active="$route.meta.activeMenu || $route.path"
      :collapse="commonStore.isCollapse"
    >
      <MenuTree :menuData="menuData"></MenuTree>
    </el-menu>
  </el-scrollbar>
</template>

<script setup lang="ts">
  import MenuTree from './MenuTree.vue'
  import { useCommonStore } from '@/store/common.ts'

  const commonStore = useCommonStore()

  const menuData = commonStore.menuData
</script>

<style lang="less">
  .el-menu.menu-box-el {
    width: 200px;
    .el-menu-item,
    .el-sub-menu {
      .svg-icon {
        margin-right: 5px;
        margin-top: -2px;
      }
    }
  }
  .el-menu--collapse.menu-box-el {
    width: 50px;
    .el-menu-item,
    .el-sub-menu {
      .svg-icon {
        width: 20px;
        height: 20px;
        margin: 0;
      }
    }
  }

  .el-sub-menu.is-active > .el-sub-menu__title {
    &,
    & > span {
      color: var(--nav-hover-color);
    }
  }

  .el-sub-menu__title,
  .el-menu-item {
    &:hover,
    &:hover > span {
      color: var(--nav-hover-color);
    }
  }

  .el-menu.el-menu--inline {
    background-color: var(--nav-inline-bg-color);
  }

  .el-menu.menu-box-el,
  .el-menu.el-menu--inline {
    border: none;
  }

  /* 设置menu不同层级的缩进 */
  @el-menu-deep: 1, 2, 3, 4;
  each(@el-menu-deep, {
      .el-menu-item-deep@{value},.el-sub-menu-deep@{value}>.el-sub-menu__title {
        padding-left: @value*15px + if((@value > 1), 5px, 0px) !important;
      }
    });

  div[id^='el-popper-container-'] .self-el-popper {
    border: none;
    .el-menu {
      padding: 0;
      background-color: var(--nav-inline-bg-color);
      border: none;
      .el-menu-item:hover {
        background-color: unset;
      }
    }
  }
</style>
