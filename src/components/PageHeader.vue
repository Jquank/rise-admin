<template>
  <header class="page-header">
    <div class="left">
      <slot name="left"></slot>
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>
  </header>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    padding: 0 18px;
    color: var(--header-text-color);
    background-color: var(--header-bg-color);
    box-shadow: 0px 4px 8px 0px var(--border-shadow-color);
  }
</style>
