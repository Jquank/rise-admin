<template>
  <el-pagination
    v-model:current-page="page.currentPage"
    v-model:page-size="page.pageSize"
    :page-sizes="[10, 20, 30, 50]"
    background
    :layout="layout"
    :total="total"
    @size-change="sizeChange"
    @current-change="currentChange"
  />
</template>

<script setup lang="ts">
  import {
    ref,
    reactive,
    useAttrs,
    watchEffect,
    onMounted,
    onUnmounted
  } from 'vue'
  import { debounce } from 'lodash-es'

  const props = defineProps<{
    callback: (arg: typeof page) => Promise<number | never | void>
    sideBorder?: boolean
  }>()
  const attrs = useAttrs()
  const page = reactive({
    currentPage: 1,
    pageSize: 10
  })
  const total = ref(0)
  const layoutPreset = 'total, sizes, prev, pager, next, jumper'
  let layout = ref(layoutPreset)

  watchEffect(() => {
    let pageSizes = attrs['page-sizes'] as number[]
    if (pageSizes) {
      page.pageSize = pageSizes[0]
    }
    layout.value = (attrs.layout || layoutPreset) as string
  })
  const sizeChange = () => {
    props.callback(page)
  }
  const currentChange = () => {
    props.callback(page)
  }
  props.callback(page).then((totalNum: number | void) => {
    total.value = totalNum || 0
  })
  const initLayout = debounce(() => {
    if (document.documentElement.clientWidth < 1050) {
      layout.value = layout.value
        .split(',')
        .filter((str) => !['total', 'sizes', 'jumper'].includes(str.trim()))
        .join(',')
    } else {
      layout.value = layoutPreset
    }
  }, 100)
  onMounted(() => {
    initLayout()
    window.addEventListener('resize', initLayout)
  })
  onUnmounted(() => {
    window.removeEventListener('resize', initLayout)
  })
</script>

<style lang="less" scoped>
  @side-border: v-bind(
    'props.sideBorder?"1px solid var(--el-border-color-lighter)":"none"'
  );
  .el-pagination {
    display: flex;
    justify-content: flex-end;
    padding: 18px 10px;
    border-left: @side-border;
    border-right: @side-border;
  }
</style>
